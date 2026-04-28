import React, { useState } from "react";
import mqtt from "mqtt";
import '../index.css';

const TOPIC = "kpi/romulus/rfid/vl457mk/set";
const mqttBrokerUrl = 'http://147.232.205.176/mqttexplorer/';
const mqttOptions = {
    port: 8000,
    username: 'maker',
    password: 'mother.mqtt.password',
};
const client = mqtt.connect(mqttBrokerUrl,mqttOptions); 

const RaspberrySettings = ({ initialData = {}, onClose }) => {
    const [mqttClientId, setMqttClientId] = useState(initialData?.mqtt?.client_id || "");
    const [mqttPassword, setMqttPassword] = useState(initialData?.mqtt?.password || "");
    const [mqttServer, setMqttServer] = useState(initialData?.mqtt?.server || "");
    const [mqttPort, setMqttPort] = useState(initialData?.mqtt?.port || "");
    const [mqttUser, setMqttUser] = useState(initialData?.mqtt?.user || "");

    const [wifiSSID, setWifiSSID] = useState(initialData?.wifi?.ssid || "");
    const [wifiKey, setWifiKey] = useState(initialData?.wifi?.key || "");

    const [ntpHost, setNtpHost] = useState(initialData?.ntpHost || "");
    const [acceptTime, setAcceptTime] = useState(initialData?.ACCEPT_TIME || "");
    const [sleepDuration, setSleepDuration] = useState(initialData?.SLEEP_DURATION || "");

    const sendUpdatedData = (updatedFields) => {
        if (client.connected) {
            console.log("Sending data to MQTT:", {
                topic: TOPIC,
                payload: JSON.stringify(updatedFields),
                qos: 2,
                retain: true,
            });

            client.publish(
                TOPIC, 
                JSON.stringify(updatedFields), 
                {
                    qos: 2, // level of delivery guarantee = 2
                    retain: true, // Retained-message
                },
                (err) => {
                    if (err) {
                        console.error("Error sending data to MQTT:", err);
                    } else {
                        console.log("Data sent successfully!");
                    }
                }
            );
        } else {
            console.error("❌ Connection to MQTT is missing");
        }
    };



    const handleSaveSettings = () => {
        const updatedData = {};

        if (mqttClientId && mqttClientId !== initialData.mqtt?.client_id) {
            updatedData.mqtt = { ...updatedData.mqtt, client_id: mqttClientId };
        }
        if (mqttPassword && mqttPassword !== initialData.mqtt?.password) {
            updatedData.mqtt = { ...updatedData.mqtt, password: mqttPassword };
        }
        if (mqttServer && mqttServer !== initialData.mqtt?.server) {
            updatedData.mqtt = { ...updatedData.mqtt, server: mqttServer };
        }
        if (mqttPort && mqttPort !== initialData.mqtt?.port) {
            updatedData.mqtt = { ...updatedData.mqtt, port: Number(mqttPort) };
        }
        if (mqttUser && mqttUser !== initialData.mqtt?.user) {
            updatedData.mqtt = { ...updatedData.mqtt, user: mqttUser };
        }

        if (wifiSSID && wifiSSID !== initialData.wifi?.ssid) {
            updatedData.wifi = { ...updatedData.wifi, ssid: wifiSSID };
        }
        if (wifiKey && wifiKey !== initialData.wifi?.key) {
            updatedData.wifi = { ...updatedData.wifi, key: wifiKey };
        }

        if (ntpHost && ntpHost !== initialData.ntpHost) {
            updatedData.ntpHost = ntpHost;
        }
        if (acceptTime && acceptTime !== initialData.ACCEPT_TIME) {
            updatedData.ACCEPT_TIME = Number(acceptTime);
        }
        if (sleepDuration && sleepDuration !== initialData.SLEEP_DURATION) {
            updatedData.SLEEP_DURATION = Number(sleepDuration);
        }

      
        console.log("Updated data to send:", updatedData);

        sendUpdatedData(updatedData);
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Nastavenia Raspberry Pi Pico</h2>

                <fieldset>
                    <legend>MQTT Nastavenia</legend>
                    <input
                        type="text"
                        value={mqttClientId}
                        onChange={(e) => setMqttClientId(e.target.value)}
                        placeholder="Client ID"
                    />
                    <input
                        type="text"
                        value={mqttPassword}
                        onChange={(e) => setMqttPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <input
                        type="text"
                        value={mqttServer}
                        onChange={(e) => setMqttServer(e.target.value)}
                        placeholder="Server"
                    />
                    <input
                        type="number"
                        value={mqttPort}
                        onChange={(e) => setMqttPort(e.target.value)}
                        placeholder="Port"
                    />
                    <input
                        type="text"
                        value={mqttUser}
                        onChange={(e) => setMqttUser(e.target.value)}
                        placeholder="User"
                    />
                </fieldset>

                <fieldset>
                    <legend>Wi-Fi Nastavenia</legend>
                    <input
                        type="text"
                        value={wifiSSID}
                        onChange={(e) => setWifiSSID(e.target.value)}
                        placeholder="SSID"
                    />
                    <input
                        type="text"
                        value={wifiKey}
                        onChange={(e) => setWifiKey(e.target.value)}
                        placeholder="Key"
                    />
                </fieldset>

                <fieldset>
                    <legend>Doplnkové Nastavenia</legend>
                    <input
                        type="text"
                        value={ntpHost}
                        onChange={(e) => setNtpHost(e.target.value)}
                        placeholder="NTP Host"
                    />
                    <input
                        type="number"
                        value={acceptTime}
                        onChange={(e) => setAcceptTime(e.target.value)}
                        placeholder="Accept Time (sec)"
                    />
                    <input
                        type="number"
                        value={sleepDuration}
                        onChange={(e) => setSleepDuration(e.target.value)}
                        placeholder="Sleep Duration (sec)"
                    />
                </fieldset>

                <div className="modal-buttons">
                    <button className="modal-button cancel" onClick={onClose}>
                        Zrušiť
                    </button>
                    <button className="modal-button save" onClick={handleSaveSettings}>
                        Poslať v .json
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RaspberrySettings;
