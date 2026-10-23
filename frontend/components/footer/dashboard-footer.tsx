"use client";

export function DashboardFooter() {
  return (
    <footer className="bg-[#081c4b] text-white">
      <div className="px-4 py-2">

        <div className="flex justify-between items-center">

          <div className="text-xs">
            DENSO VIETNAM CO., LTD.  |  D2 – Factory Hackathon  |  Warehouse Control Tower (Simulation / Demo Data)
          </div>

          <div className="text-right text-xs">
            <div>
              Focus on warehouse logistics: Receiving, Put-away, Storage, Picking/Kitting, Staging, Material Handover to Production
            </div>
            <div>
              Product groups: VIC, AVS, O2 Sensor, AT-SOL, CVT, DCT, EGRV, LS-EGR, OCV, VCT Rotor, VCT Housing, I-VLV
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}