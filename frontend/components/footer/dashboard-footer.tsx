"use client";

export function DashboardFooter() {
  return (
    <footer className="bg-[#081c4b] text-white">
      <div className="px-4 py-2">
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:justify-between
            md:items-center
            gap-2
          "
        >
          {/* Left */}
          <div className="text-xs">
            DENSO VIETNAM CO., LTD. | D2 – Factory Hackathon | Warehouse Control Tower
            (Simulation / Demo Data)
          </div>

          {/* Right */}
          <div className="text-xs text-left md:text-right">
            <div>
              Focus on warehouse logistics: Receiving, Put-away, Storage,
              Picking/Kitting, Staging, Material Handover to Production
            </div>

            <div>
              Product groups: VIC, AVS, O2 Sensor, AT-SOL, CVT, DCT, EGRV,
              LS-EGR, OCV, VCT Rotor, VCT Housing, I-VLV
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}