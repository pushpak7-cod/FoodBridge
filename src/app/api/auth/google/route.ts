import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createSessionToken, setSessionCookie, createDbSession, sanitizeUser } from '@/lib/auth';

const googleAuthSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatar_url: z.string().optional(),
  role: z.enum(['restaurant', 'ngo', 'driver']).default('restaurant'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = googleAuthSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid Google OAuth payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, avatar_url, role } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        restaurant_profile: true,
        ngo_profile: true,
        driver_profile: true,
      },
    });

    if (user) {
      // Update avatar & last login
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          last_login_at: new Date(),
          avatar_url: avatar_url || user.avatar_url,
          auth_provider: 'google',
        },
        include: {
          restaurant_profile: true,
          ngo_profile: true,
          driver_profile: true,
        },
      });
    } else {
      // Create user and associated profile
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name,
            email: normalizedEmail,
            phone: '+91 98765 43210',
            password_hash: '$2a$12$DUMMY_GOOGLE_AUTH_HASH_PLACEHOLDER_SECURE_RANDOM',
            role,
            verified_status: 'verified',
            status: 'active',
            avatar_url: avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
            auth_provider: 'google',
            last_login_at: new Date(),
          },
        });

        if (role === 'restaurant') {
          await tx.restaurantProfile.create({
            data: {
              user_id: newUser.id,
              business_name: `${name}'s Kitchen`,
              address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
              lat: 12.9716,
              lng: 77.6412,
              cuisine_type: 'Multi-Cuisine & Healthy Meals',
              operating_hours: '11:00 AM - 11:00 PM',
              contact_person: name,
              phone: '+91 98765 43210',
              email: normalizedEmail,
              fssai_license: '11223344556601',
              fssai_expiry: '2028-12-31',
              gstin: '29AAAAA0000A1Z5',
              pan_number: 'AAAAA0000A',
              trade_license_no: 'BBMP/HL/2024/0088',
              fostac_supervisor_name: name,
              establishment_type: 'Dine-in Restaurant',
              city: 'Bengaluru',
              pincode: '560038',
              fssai_surplus_declaration: true,
              logistics_capability: 'staff_handoff_cold_storage',
              photos: JSON.stringify(['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600']),
              total_meals_donated: 0,
              co2_saved_kg: 0,
              rating: 5.0,
            },
          });
        } else if (role === 'ngo') {
          await tx.nGOProfile.create({
            data: {
              user_id: newUser.id,
              org_name: `${name} Relief Society`,
              registration_no: 'REG-NGO-2024-KA-9911',
              darpan_id: 'KA/2024/0088991',
              registration_type: 'Public Charitable Trust',
              pan_number: 'AABTP9999K',
              section_12a_80g: '12A/80G/CIT(E)/BLR/2024-25/X-99',
              fcra_status: 'Domestic Relief Only',
              authorized_signatory: name,
              city: 'Bengaluru',
              pincode: '560025',
              hygiene_undertaking: true,
              service_area: 'Bengaluru Urban',
              address: 'MG Road, Bengaluru 560001',
              lat: 12.975,
              lng: 77.61,
              capacity_per_day: 500,
              storage_capacity: 'Commercial refrigerator and insulated hotboxes',
              has_own_transport: true,
              contact_person: name,
              phone: '+91 98765 43210',
              email: normalizedEmail,
              total_meals_received: 0,
              people_served: 0,
            },
          });
        } else {
          await tx.driverProfile.create({
            data: {
              user_id: newUser.id,
              full_legal_name: name,
              phone: '+91 98765 43210',
              email: normalizedEmail,
              dl_number: 'KA-01-2024-0099881',
              dl_expiry: '2035-10-15',
              aadhaar_last4: '9988',
              vehicle_number: 'KA-01-MJ-9988',
              vehicle_type: 'Cargo Van (Maruti Eeco Cargo)',
              puc_number: 'PUC-KA-2024-9988',
              puc_expiry: '2025-12-31',
              insurance_policy_no: 'INS-BAJAJ-2024-9988',
              has_insulated_carrier: true,
              emergency_contact_name: 'Emergency Desk',
              emergency_contact_phone: '+91 98765 43210',
              service_city: 'Bengaluru',
              service_pincodes: JSON.stringify(['560001', '560025', '560034', '560038']),
              volunteer_pledge: true,
              total_pickups_completed: 0,
              rating: 5.0,
            },
          });
        }

        return tx.user.findUnique({
          where: { id: newUser.id },
          include: {
            restaurant_profile: true,
            ngo_profile: true,
            driver_profile: true,
          },
        });
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to process Google sign in' }, { status: 500 });
    }

    // Create session token and set cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await createDbSession(user.id, token, req.headers.get('user-agent') || undefined);
    await setSessionCookie(token);

    return NextResponse.json({
      message: 'Signed in with Google successfully',
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    console.error('Google Auth Route Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during Google sign in' },
      { status: 500 }
    );
  }
}
