import { useState } from "react";
import { useTranslation } from "@/components/TranslationContext";
import type { DatabaseEntry } from "./DatabaseApp";

interface DatabaseEntryViewProps {
    databaseEntry: DatabaseEntry;
    handleSave: (databaseEntry: DatabaseEntry) => void;
}

export default function DatabaseEntryView(props: DatabaseEntryViewProps) {
    const { t } = useTranslation();

    const [evidenceData, setEvidenceData] = useState<DatabaseEntry>(props.databaseEntry);

    const handleChange = (field: keyof DatabaseEntry, value: string) => {
        setEvidenceData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return <div className="w-full h-full p-4 bg-window flex justify-center">
        <div className="w-[60%] h-full flex flex-col justify-evenly items-center">
            <label className="text-22.5 uppercase">
                {t("laptop.desktop_screen.common.firstname_placeholder")}
                <input className="input textable" maxLength={25} value={evidenceData.firstname || ""} onChange={(e) => handleChange("firstname", e.target.value)} />
            </label>

            <label className="text-22.5 uppercase">
                {t("laptop.desktop_screen.common.lastname_placeholder")}
                <input className="input textable" maxLength={25} value={evidenceData.lastname || ""} onChange={(e) => handleChange("lastname", e.target.value)} />
            </label>

            <label className="text-22.5 uppercase">
                {t("laptop.desktop_screen.common.birthdate_placeholder")}
                <input className="input textable" maxLength={25} value={evidenceData.birthdate || ""} onChange={(e) => handleChange("birthdate", e.target.value)} />
            </label>

            <button className="flex justify-center items-center gap-2 mt-4 px-4 py-2 border-none rounded-10 text-white duration-400 transition-all bg-[rgb(48,209,88)] hover:-translate-y-0.5 hover:shadow-button hoverable" onClick={() => props.handleSave(evidenceData)}>
                <svg width="30px" height="30px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
                </svg>
                <span className="text-30">{t("laptop.desktop_screen.common.save_button")}</span>
            </button>
        </div>
    </div>
}