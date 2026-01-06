import { useTranslation } from "../TranslationContext";
import type { ChosenEvidence, EvidenceData, EvidenceDetails } from "./EvidenceChooser";
import { Tooltip } from "./Tooltip";


export interface EvidenceDataViewTranslations {
    tooltipSave: string;
    noEvidenceSelected: string;
}

interface EvidenceDataViewProps {
    type: "FINGERPRINT" | "DNA";
    chosenEvidence: ChosenEvidence | null;
    evidenceDetails: EvidenceDetails | null;
    evidenceData: EvidenceData | null;
    translations: EvidenceDataViewTranslations;
    onEvidenceDetailsChange: (field: keyof EvidenceDetails, value: string) => void;
    onEvidenceDataChange: (field: keyof EvidenceData, value: string) => void;
    onEvidenceDataSave: () => void;
    onEvidenceLabelling: () => void;
}

export default function EvidenceDataView(props: EvidenceDataViewProps) {
    const { t } = useTranslation();

    return (
        <div className="flex-1 h-full flex flex-col">
           {props.chosenEvidence?.evidence
                ? <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="w-full flex items-center gap-2 mt-4">
                        <img src={props.chosenEvidence.evidence.imagePath} className="w-9 h-9"></img>
                        <p className="text-45 font-medium">{props.chosenEvidence.evidence.label}</p>
                    </div>

                    <div className="w-full flex gap-2 mt-4">
                        <div className="w-1/2 flex flex-col gap-2">
                            <span className="text-22.5 leading-none uppercase">{t("laptop.desktop_screen.common.crime_scene_placeholder")}</span>
                            <input className="input textable" maxLength={250} value={props.evidenceDetails?.crimeScene || ""} onChange={(e) => props.onEvidenceDetailsChange("crimeScene", e.target.value)} />
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <span className="text-22.5 leading-none uppercase">{t("laptop.desktop_screen.common.collection_time_placeholder")}</span>
                            <input className="input textable" maxLength={50} value={props.evidenceDetails?.collectionTime || ""} onChange={(e) => props.onEvidenceDetailsChange("collectionTime", e.target.value)} />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2 mt-6">
                        <span className="w-full text-22.5 leading-none uppercase">{t("laptop.desktop_screen.common.additional_data_placeholder")}</span>
                        <textarea className="input h-22.5 resize-none scrollbar textable" maxLength={500} value={props.evidenceDetails?.additionalData || ""} onChange={(e) => props.onEvidenceDetailsChange("additionalData", e.target.value)} />
                    </div>

                    <div className="w-full border-b-2 border-[gray] my-5 mt-6" />

                    <p className="text-25 leading-none">{props.translations.tooltipSave}</p>

                    <div className="flex gap-2 mt-6">
                        <div className="w-[35%] flex flex-col gap-2">
                            <span className="w-full text-22.5 leading-none uppercase">{t("laptop.desktop_screen.common.firstname_placeholder")}</span>
                            <input className="input textable" maxLength={25} value={props.evidenceData?.firstname || ""} onChange={(e) => props.onEvidenceDataChange("firstname", e.target.value)} />
                        </div>
                        <div className="w-[35%] flex flex-col gap-2">
                            <span className="w-full text-22.5 leading-none uppercase">{t("laptop.desktop_screen.common.lastname_placeholder")}</span>
                            <input className="input textable" maxLength={25} value={props.evidenceData?.lastname || ""} onChange={(e) => props.onEvidenceDataChange("lastname", e.target.value)} />
                        </div>
                        <div className="w-[30%] flex flex-col gap-2">
                            <span className="w-full text-22.5 leading-none uppercase">{t("laptop.desktop_screen.common.birthdate_placeholder")}</span>
                            <input className="input textable" maxLength={25} value={props.evidenceData?.birthdate || ""} onChange={(e) => props.onEvidenceDataChange("birthdate", e.target.value)} />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center items-center flex-1">
                       <button className="flex justify-center items-center gap-2 px-4 py-2 border-none rounded-10 text-white duration-400 transition-all bg-[rgb(48,209,88)] hoverable hover:-translate-y-0.5 hover:shadow-button" onClick={props.onEvidenceDataSave}>
                            <svg width="30px" height="30px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z"/>
                            </svg>
                            <span className="text-30 leading-7">{t("laptop.desktop_screen.common.save_button")}</span>
                        </button>

                        <Tooltip text={t("laptop.desktop_screen.common.tooltip_label")}>
                            <button className="flex justify-center items-center gap-2 px-4 py-2 border-none rounded-10 text-white duration-400 transition-all bg-[rgb(255,141,40)] hoverable hover:-translate-y-0.5 hover:shadow-button" onClick={props.onEvidenceLabelling}>
                                <svg width="30px" height="30px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/>
                                </svg>
                                <span className="text-30 leading-7">{t("laptop.desktop_screen.common.label_button")}</span>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                : <div className="w-full h-full flex justify-center items-center gap-2">
                    {props.type == "DNA"
                        ? <svg width="50px" height="50px" fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M200-40v-40q0-139 58-225.5T418-480q-102-88-160-174.5T200-880v-40h80v40q0 11 .5 20.5T282-840h396q1-10 1.5-19.5t.5-20.5v-40h80v40q0 139-58 225.5T542-480q102 88 160 174.5T760-80v40h-80v-40q0-11-.5-20.5T678-120H282q-1 10-1.5 19.5T280-80v40h-80Zm138-640h284q13-19 22.5-38t17.5-42H298q8 22 17.5 41.5T338-680Zm142 148q20-17 39-34t36-34H405q17 17 36 34t39 34Zm-75 172h150q-17-17-36-34t-39-34q-20 17-39 34t-36 34ZM298-200h364q-8-22-17.5-41.5T622-280H338q-13 19-22.5 38T298-200Z"/>
                        </svg>
                        : <svg width="100px" height="100px" fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M481-781q106 0 200 45.5T838-604q7 9 4.5 16t-8.5 12q-6 5-14 4.5t-14-8.5q-55-78-141.5-119.5T481-741q-97 0-182 41.5T158-580q-6 9-14 10t-14-4q-7-5-8.5-12.5T126-602q62-85 155.5-132T481-781Zm0 94q135 0 232 90t97 223q0 50-35.5 83.5T688-257q-51 0-87.5-33.5T564-374q0-33-24.5-55.5T481-452q-34 0-58.5 22.5T398-374q0 97 57.5 162T604-121q9 3 12 10t1 15q-2 7-8 12t-15 3q-104-26-170-103.5T358-374q0-50 36-84t87-34q51 0 87 34t36 84q0 33 25 55.5t59 22.5q34 0 58-22.5t24-55.5q0-116-85-195t-203-79q-118 0-203 79t-85 194q0 24 4.5 60t21.5 84q3 9-.5 16T208-205q-8 3-15.5-.5T182-217q-15-39-21.5-77.5T154-374q0-133 96.5-223T481-687Zm0-192q64 0 125 15.5T724-819q9 5 10.5 12t-1.5 14q-3 7-10 11t-17-1q-53-27-109.5-41.5T481-839q-58 0-114 13.5T260-783q-8 5-16 2.5T232-791q-4-8-2-14.5t10-11.5q56-30 117-46t124-16Zm0 289q93 0 160 62.5T708-374q0 9-5.5 14.5T688-354q-8 0-14-5.5t-6-14.5q0-75-55.5-125.5T481-550q-76 0-130.5 50.5T296-374q0 81 28 137.5T406-123q6 6 6 14t-6 14q-6 6-14 6t-14-6q-59-62-90.5-126.5T256-374q0-91 66-153.5T481-590Zm-1 196q9 0 14.5 6t5.5 14q0 75 54 123t126 48q6 0 17-1t23-3q9-2 15.5 2.5T744-191q2 8-3 14t-13 8q-18 5-31.5 5.5t-16.5.5q-89 0-154.5-60T460-374q0-8 5.5-14t14.5-6Z"/>
                        </svg>
                    }
                    <p className="w-1/2 text-25">{props.translations.noEvidenceSelected}</p>
                </div>
            }
        </div>
    );
}