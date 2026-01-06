import { useTranslation } from "@/components/TranslationContext";

interface DatabaseSearchFiltersProps {
    searchText: string;
    dnaChecked: boolean;
    fingerprintsChecked: boolean;
    handleSearchTextChange: (newText: string) => void;
    handleDnaCheckedChange: (dnaChecked: boolean) => void;
    handleFinterprintsChecked: (fingerprintsChecked: boolean) => void;
}

export default function DatabaseSearchFilters(props: DatabaseSearchFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center gap-4">
            <input
                type="text"
                className="input w-auto text-40 textable"
                placeholder={t("laptop.desktop_screen.database_app.search_placeholder")}
                onChange={(e) => props.handleSearchTextChange(e.target.value)}
                value={props.searchText}
            />
            <div className="flex flex-col justify-between">
                <label className="flex items-center gap-1 text-30 hoverable">
                    <input
                        type="checkbox"
                        checked={props.dnaChecked}
                        onChange={(e) => props.handleDnaCheckedChange(e.target.checked)}
                        className="w-6 h-6"
                    />
                    {t("laptop.desktop_screen.database_app.types.dna")}
                </label>

                <label className="flex items-center gap-1 text-30 hoverable">
                    <input
                        type="checkbox"
                        checked={props.fingerprintsChecked}
                        onChange={(e) => props.handleFinterprintsChecked(e.target.checked)}
                        className="w-6 h-6"
                    />
                    {t("laptop.desktop_screen.database_app.types.fingerprint")}
                </label>
            </div>
        </div>
    );
}