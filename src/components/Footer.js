import React from "react";
import BlurCard from "./BlurCard";
import { Link } from "@mui/material";


export default function Footer() {
    return (
        <div className="">
            <BlurCard>
                <p className="text-white font-bold flex justify-center">© 2025 雪域provealms. All rights reserved.</p>
                <p className="text-white font-bold flex justify-center">Powered by &nbsp;<Link href="https://heartfirey.top" underline="always">HeartFireY</Link></p>
            </BlurCard>
        </div>
    );
}
