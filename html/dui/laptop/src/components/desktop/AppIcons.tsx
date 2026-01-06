import AppIcon from "./AppIcon";
import type { App } from "@/data/apps";


// Props parsed by the parsed.
interface AppIconsProps {
    apps: App[];
    openApp: (app: App) => void;
}


// Renders all the icons on the desktop.
export default function AppIcons(props: AppIconsProps) {
    return <div className="grid grid-flow-col grid-cols-[repeat(5,1fr)] grid-rows-[repeat(5,1fr)] w-120 h-120">
        {props.apps.map(app => <AppIcon app={app} width="95px" height="95px" onClick={(app) => props.openApp(app)} />)}
    </div>
}