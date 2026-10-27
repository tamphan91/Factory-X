"use client";

import { ArrowRight, Boxes } from "lucide-react";

export function PutawayPanel() {
    return (
        <div
            className="
            border
            border-slate-500
            rounded-md
            p-3
            flex
            flex-col
            items-center
            justify-center
            h-full
            "
        >
            <div
                className="
                bg-[#24488f]
                rounded
                px-4
                py-3
                text-center
                font-semibold
                "
            >
                Put-away
                <br />
                Waiting Area
            </div>

            <Boxes
                size={42}
                className="
                mt-5
                text-slate-300
                "
            />

            <div
                className="
                mt-5
                text-lg
                "
            >
                Queue:
                <span
                    className="
                    text-red-400
                    font-bold
                    "
                >
                    {" "}
                    5
                </span>
            </div>

            <div
                className="
                text-slate-300
                mt-2
                "
            >
                Avg. 32 min
            </div>
        </div>
    );
}