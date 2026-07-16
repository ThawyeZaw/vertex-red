// DonorPassportCard — green gradient hero card
// Thinzar Kyaw — Frontend Domain

import { Droplets, Shield, Heart } from "lucide-react";
import type { Profile } from "@/utils/supabase";

interface DonorPassportCardProps {
  profile: Profile;
  donationCount?: number;
}

const getHeroLevel = (donations: number) => {
  if (donations >= 20) return "GOLD";
  if (donations >= 10) return "SILVER";
  return "BRONZE";
};

const getMemberYear = (createdAt: string) =>
  new Date(createdAt).getFullYear();

export const DonorPassportCard = ({
  profile,
  donationCount = 0,
}: DonorPassportCardProps) => {
  const heroLevel = getHeroLevel(donationCount);
  const memberYear = getMemberYear(profile.created_at);

  return (
    <div className="mx-4 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 p-5 shadow-lg">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-200 uppercase">
            Donor Passport
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {profile.full_name}
          </h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
          <Droplets className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Hero level & blood type */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-emerald-200" />
          <span className="text-xs font-bold text-emerald-100 tracking-wider">
            HERO LEVEL: {heroLevel}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold tracking-widest text-emerald-200 uppercase">
            Blood Type
          </p>
          <p className="text-2xl font-black text-white leading-tight">
            {profile.blood_type ?? "—"}
          </p>
        </div>
      </div>

      <p className="mt-0.5 text-sm text-emerald-200">
        Member since {memberYear}
      </p>

      {/* Bottom stats */}
      <div className="mt-4 flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/15 px-3 py-2.5">
          <Shield className="h-4 w-4 text-emerald-200 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Verified Donor</p>
            <p className="text-xs text-emerald-200">
              ID {profile.id.slice(0, 12).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/15 px-3 py-2.5">
          <Heart className="h-4 w-4 text-emerald-200 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">
              {donationCount} Donations
            </p>
            <p className="text-xs text-emerald-200">Universal donor</p>
          </div>
        </div>
      </div>
    </div>
  );
};
