import { useEffect, useState } from "react";

export interface EvidenceDetails {
    crimeScene: string;
    collectionTime: string;
    additionalData: string;
}

interface InventoryItem {
    imagePath: string;
    label: string;
    slot: number;
    identifier: string;
    details: EvidenceDetails
}

interface Inventory {
    container: number | string;
    label: string;
    items: InventoryItem[];
}

type Inventories = Inventory[];


export interface EvidenceData {
    identifier: string;
    firstname: string;
    lastname: string;
    birthdate: string;
}


export interface ChosenEvidence {
    evidence: {
        label: string;
        imagePath: string;
        container: number | string,
        slot: number,
        identifier: string
    } | null,
    timestamp: number
}


export interface EvidenceChooserTranslations {
    noItemsWithEvidences: string;
}

interface EvidenceChooserProps {
    type: "FINGERPRINT" | "DNA";
    chosenEvidence: ChosenEvidence | null;
    translations: EvidenceChooserTranslations;
    onEvidenceSelection: (label: string, imagePath: string, container: number | string, slot: number, identifier: string, details: EvidenceDetails) => void;
}


export default function EvidenceChooser(props: EvidenceChooserProps) {
    const [inventories, setInventories] = useState<Inventories | null>(null);


    const updateInventories = () => {
        fetch(`https://${location.host}/triggerServerCallback`, {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                name: "evidences:getPlayersItemsWithBiometricData",
                arguments: {
                    type: props.type
                }
            })
        }).then(response => response.json()).then(response => {
            setInventories(response);
        });
    }

    useEffect(() => {
        if (!props.chosenEvidence?.evidence) updateInventories();
    }, [props.chosenEvidence]);

    return inventories && (
        <div className="w-70 h-full px-3 py-4 bg-white/20 shadow-glass border-2 border-white/80 rounded-16 overflow-y-hidden hover:overflow-y-auto scrollbar">
            <div className="flex flex-col gap-6">
                {inventories.length == 0
                    ? <p className="text-20 leading-none">{props.translations.noItemsWithEvidences}</p>
                    : inventories.map((inventory) =>
                        <div key={inventory.container} className="flex flex-col gap-1">
                            <p className="px-1 text-20 leading-none uppercase">{inventory.label}</p>
                            {inventory.items.map((item) => {
                                const active = props.chosenEvidence?.evidence
                                    && inventory.container == props.chosenEvidence.evidence.container
                                    && item.slot == props.chosenEvidence.evidence.slot
                                    && item.identifier == props.chosenEvidence.evidence.identifier

                                return (
                                    <button
                                        key={item.identifier}
                                        className={`w-full flex justify-start items-center gap-4 px-1 py-1.5 border-none rounded-10 ${active ? "bg-button" : "bg-transparent"} duration-400 hover:bg-button hoverable`}
                                        onClick={() => props.onEvidenceSelection(item.label, item.imagePath, inventory.container, item.slot, item.identifier, item.details)}
                                    >
                                        <img src={item.imagePath} className="w-7 h-7"></img>
                                        <p className="text-30 leading-none text-left capitalize truncate">{item.label}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )
                }
            </div>
        </div>
    );
}