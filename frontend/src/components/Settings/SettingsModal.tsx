"use client";
import { Dialog } from "@headlessui/react";
import styles from "./SettingsModal.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { MutableRefObject, useRef, useState } from "react";
import Slider from "./Slider";

interface SettingsModalProps {
    refreshSpeed: number,
    setRefreshSpeed: (value: number) => void
}

export default function SettingsModal({refreshSpeed, setRefreshSpeed} : SettingsModalProps) {
    const router = useRouter();
    const enabled = useSearchParams().get("settings");

    let overlayRef = useRef() as MutableRefObject<HTMLDivElement | null>;
    const onClose = () => router.push("/");

    const [displayRefreshSpeed, setDisplayRefreshSpeed] = useState(refreshSpeed);

    return (
        <>
            {enabled && (
            <div className={styles["modal-container"]}>
                <Dialog static open={true} onClose={onClose} initialFocus={overlayRef} className={styles["settings-modal"]}>
                    <h2 className={styles["settings-header"]}>Settings</h2>

                    <div className={styles["refresh-speed"]}>
                        <div className={styles["slider-label"]}>
                            <h3 className={styles["label-header"]}>Refresh Speed</h3>
                            <p className={styles["label-value"]}>
                                {displayRefreshSpeed} second{(displayRefreshSpeed > 1) && <span>s</span>}
                            </p>
                        </div>
                        <Slider 
                            step={1}
                            min={1}
                            max={10}
                            value={displayRefreshSpeed}
                            setDisplayValue={setDisplayRefreshSpeed}
                            updateValue={setRefreshSpeed}
                        />
                    </div>
                    
                    <button className={styles["button-close"]} onClick={onClose}>Close</button>
                </Dialog>
            </div>
            )}
        </>
    )
}
