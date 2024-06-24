"use client";

import styles from "./SettingsModal.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { MutableRefObject, useRef, useState } from "react";
import Slider from "./Slider";
import { Dialog } from "@headlessui/react";
import ReactSwitch from "react-switch";

interface SettingsModalProps {
    refreshSpeed: number;
    setRefreshSpeed: (value: number) => void;
    includeWithdrawFees: boolean;
    setIncludeWithdrawFees: (value: boolean) => void;
    arbitrageView: boolean;
    setArbitrageView: (value: boolean) => void;
    arbitrageViewAvailable: boolean;
}

export default function SettingsModal(props: SettingsModalProps) {
    const {refreshSpeed, setRefreshSpeed, includeWithdrawFees, setIncludeWithdrawFees, arbitrageView, setArbitrageView, arbitrageViewAvailable} = props;

    const router = useRouter();
    const enabled = useSearchParams().get("settings");

    let overlayRef = useRef() as MutableRefObject<HTMLDivElement | null>;
    const onClose = () => router.push("/");

    const [displayRefreshSpeed, setDisplayRefreshSpeed] = useState(refreshSpeed);

    const disabledColor = arbitrageView ? {"opacity": "75%"} : {"opacity": "100%"};

    return (
        <>
            {enabled && (
            <div className={styles["modal-container"]}>
                <Dialog static open={true} onClose={onClose} initialFocus={overlayRef} className={styles["settings-modal"]}>
                    <h2 className={styles["settings-header"]}>Settings</h2>

                    <label className={styles["toggle-setting"]}>
                        <span className={styles["settings-label"]}>Enable arbitrage view</span>
                        <ReactSwitch 
                            checked={arbitrageView && arbitrageViewAvailable} 
                            onChange={setArbitrageView} 
                            offColor="#ccc"
                            onColor="#2780A6"
                            checkedIcon={false}
                            uncheckedIcon={false}   
                            height={25}
                            disabled={!arbitrageViewAvailable}
                        />
                    </label>

                    <label className={styles["toggle-setting"]}>
                        <span className={styles["settings-label"]} style={disabledColor as React.CSSProperties}>Include withdraw fees in prices</span>
                        <ReactSwitch 
                            checked={arbitrageView || includeWithdrawFees} 
                            onChange={setIncludeWithdrawFees} 
                            offColor="#ccc"
                            onColor="#2780A6"
                            checkedIcon={false}
                            uncheckedIcon={false}
                            height={25}
                            disabled={arbitrageView}
                        />
                    </label>

                    <div className={styles["refresh-speed"]}>
                        <div className={styles["slider-label"]}>
                            <h3 className={styles["settings-label"]}>Refresh Speed</h3>
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
