import { IonText, IonTextarea, IonCard, IonCardTitle, IonDatetimeButton, IonDatetime, IonPopover } from "@ionic/react";
import MoodIcon from "../../MoodIcon/MoodIcon";
import { useState } from "react";
import Entry from "../../../models/entry/Entry";
import AddEntryModalStep from "../AddEntryModalStep";
import { Translation, useTranslation } from "i18nano";
import MoodService from "../../../services/MoodService";
import AddMoodPage from "./AddMoodPage";

interface Props {
    entry: Entry;
    close: () => void;
    save: (entry: Entry) => Promise<void>;
}

export default ({entry, close, save}: Props) => {
    const initialDate = entry.date ?? new Date();
    const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
    const isoDate = (new Date(initialDate.getTime() - timeZoneOffset)).toISOString().slice(0, -1);
    const [date, setDate] = useState<string>(isoDate);
    const title = '';
    const canSave = true;
    const nextComponent = <AddMoodPage {...{close, save, prevTitle: 'modal.back', entry: {...entry, date: new Date(date)}}} />;
        
    return (
        <AddEntryModalStep {...{title, nextComponent, mood: entry.mood, close, canSave}}>
            <IonCardTitle className="ion-padding-vertical ion-text-center">
                <Translation path="modal.logAnEmotionOrMood" />
            </IonCardTitle>
            <IonDatetimeButton className="ion-padding-top" datetime="datetime" id="datetime-button" />
            <IonPopover keepContentsMounted={true} trigger="datetime-button">
                <IonDatetime id="datetime" style={{borderRadius: '12px'}} size="cover" preferWheel={true} value={date} max={isoDate} onIonChange={({detail}) => setDate(detail.value as string)} />
            </IonPopover>
        </AddEntryModalStep>
    );
}