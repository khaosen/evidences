import { useEffect, useState } from "react";
import useLuaCallback from "../../../../hooks/useLuaCallback";
import { useTranslation } from "../../../TranslationContext";
import { useAppContext } from "../../../../hooks/useAppContext";
import styles from "../../../../css/WiretapNotificationPopUp.module.css";

export default function WiretapNotificationPopUp() {
    const { t } = useTranslation();
    const appContext = useAppContext();
    const [input, setInput] = useState<string>("");
    const [subscribedTarget, setSubscribedTarget] = useState<string>("");
    const [isSubscribed, setSubscribed] = useState<boolean>(false);

    const {loading, trigger: triggerGetSubscription} = useLuaCallback<void, string>({
        name: "evidences:getSubscriptionTarget",
        onSuccess: (data) => {
            setInput(data);

            if (data) {
                setSubscribedTarget(data);
                setSubscribed(true);
            }
        }
    });

    const {trigger: subscribe} = useLuaCallback<{ target: string | null }, void>({
        name: "evidences:subscribe"
    });

    useEffect(triggerGetSubscription, []);

    const sendNotifications = (target: string | null) => {
        if (!target) {
            setInput("");
            setSubscribedTarget("");
            setSubscribed(false);
        } else {
            setSubscribedTarget(target);
            setSubscribed(true);
        }

        subscribe({target: target});
    };

    const unsubscribed_placeholder = appContext.options?.displayPhoneNumbers ? "placeholder_phone_number" : "placeholder_full_name";
    const unsubscribed_translation = t(`laptop.desktop_screen.wiretap_app.phone_calls.notifications.${unsubscribed_placeholder}`);

    return <div style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", background: "#c0c0c0ff" }}>
        <div style={{ width: "60%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
            {loading && <p style={{ fontSize: "30px", fontStyle: "italic" }}>{t("laptop.desktop_screen.wiretap_app.phone_calls.notifications.status_loading")}</p>}
            {!loading && (<>
                {isSubscribed
                    ? <p style={{ fontSize: "30px" }}>{t("laptop.desktop_screen.wiretap_app.phone_calls.notifications.status_subscribed", subscribedTarget)}</p>
                    : <p style={{ fontSize: "30px" }}>{t("laptop.desktop_screen.wiretap_app.phone_calls.notifications.status_unsubscribed", unsubscribed_translation)}</p>
                }
                <input className={`${styles.input} textable`} maxLength={35} placeholder={unsubscribed_translation} value={input} onChange={(e) => setInput(e.target.value)} />

                <div style={{ display: "flex", gap: "20px" }}>
                    <button className={`${styles.button} ${styles.subscribe__button} hoverable`} onClick={() => sendNotifications(input)}>{t("laptop.desktop_screen.wiretap_app.phone_calls.notifications.subscribe_button")}</button>
                      <button className={`${styles.button} ${styles.unsubscribe__button} hoverable`} onClick={() => sendNotifications(null)}>{t("laptop.desktop_screen.wiretap_app.phone_calls.notifications.unsubscribe_button")}</button>
                </div>
            </>)}
        </div>
    </div>
}