"use client";
import { Dialog } from "@headlessui/react";
import styles from "./SettingsModal.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { MutableRefObject, useRef, useState } from "react";
import Slider from "./Slider";

export default function SettingsModal() {
    const router = useRouter();
    const enabled = useSearchParams().get("settings");

    let overlayRef = useRef() as MutableRefObject<HTMLDivElement | null>;
    const onClose = () => router.push("/");

    const [displayRefreshSpeed, setDisplayRefreshSpeed] = useState(5);

    const STEP = 1;
    const MIN = 1;
    const MAX = 10;

    return (
        <>
            {enabled && (
            <div className={styles["modal-container"]}>
                <Dialog static open={true} onClose={onClose} initialFocus={overlayRef} className={styles["settings-modal"]}>
                    <h2>Settings</h2>

                    <div className={styles["refresh-speed"]}>
                        <div className={styles["slider-label"]}>
                            <h3>Refresh Speed</h3>
                            <p>{displayRefreshSpeed} second{(displayRefreshSpeed > 1) && <span>s</span>}</p>
                        </div>
                        <Slider 
                            step={1}
                            min={1}
                            max={10}
                            value={displayRefreshSpeed}
                            setDisplayValue={setDisplayRefreshSpeed}
                        />
                    </div>

                    <button onClick={onClose}>Close</button>
                </Dialog>
            </div>
            )}
        </>
    )
}
