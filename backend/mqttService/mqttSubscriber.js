import mqtt from 'mqtt';
import pool from '../database.js';

const mqttBrokerUrl = 'http://147.232.205.176/mqttexplorer/';
const mqttOptions = {
    port: 1883,
    username: 'maker',
    password: 'mother.mqtt.password',
};

const client = mqtt.connect(mqttBrokerUrl, mqttOptions);
const topic = 'kpi/romulus/rfid/vl457mk';


client.on('connect', () => {
    console.log('Connection to MQTT is successful');

    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Error subscribing to topic:', err.message);
        } else {
            console.log(`Subscription to topic "${topic}" successful`);
        }
    });
});


client.on('message', async (topic, message) => {
    console.log(`Message from topic ${topic}: ${message.toString()}`);

});


client.on('message', async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        console.log(`\n=== New message from topic "${topic}" ===`);
        console.log(`Received data: ${JSON.stringify(data, null, 2)}`);

        if (data.attendances && Array.isArray(data.attendances)) {
            for (const attendance of data.attendances) {
                const { student_id, cviky_id, dt } = attendance;
                console.log(`Processing student: ${student_id}, pair: ${cviky_id}, time: ${dt}`);

                // Log before executing SQL query
                console.log("Executing query to check pair...");
                console.log(`SQL: SELECT * FROM cviky WHERE id = ${cviky_id} AND day_name = to_char('${dt}', 'Day') AND '${dt}'::time BETWEEN (time_start - interval '15 minutes') AND (time_start + interval '30 minutes');`);

                // Проверка на правильность пары
                const query = `
                    SELECT *
                    FROM cviky
                    WHERE id = $1
                      AND trim(day_name) = trim(to_char($2::timestamp, 'Day'))
                      AND $2::time BETWEEN (time_start - interval '5 minutes')
                                       AND (time_start + interval '30 minutes');
                `;

                const values = [cviky_id, dt];
                const result = await pool.query(query, values);

                if (result.rows.length > 0) {
                    console.log(`Student ${student_id} arrived at the correct pair ${cviky_id}.`);

                    const updateQuery = `
                        UPDATE studenty
                        SET present = true, timestamp = $1
                        WHERE isic = $2 AND cviky_id = $3
                            RETURNING *;
                    `;
                    const updateValues = [dt, student_id, cviky_id];
                    const updateResult = await pool.query(updateQuery, updateValues);

                    if (updateResult.rowCount > 0) {
                        console.log(`Presence updated: ${JSON.stringify(updateResult.rows[0], null, 2)}`);


                        const semesterStartDate = new Date('2025-01-03T00:00:00Z'); 

                        const currentWeek = Math.ceil(
                            (new Date(dt).getTime() - semesterStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
                        );



                        const attendanceUpdateQuery = `
                            UPDATE attendance_weeks
                            SET attended = true
                            WHERE student_id = $1 AND cviky_id = $2 AND week_number = $3
                                RETURNING *;
                        `;
                        const attendanceValues = [student_id, cviky_id, currentWeek];
                        const attendanceResult = await pool.query(attendanceUpdateQuery, attendanceValues);

                        if (attendanceResult.rowCount > 0) {
                            console.log(`Week ${currentWeek} marked as attended for student ${student_id}.`);
                        } else {
                            console.warn(`Failed to update attendance data for week ${currentWeek}.`);
                        }
                    } else {
                        console.warn(`Student ${student_id} not found in table "studenty".`);
                    }
                } else {
                    console.warn(`Student ${student_id} arrived at the wrong pair or at the wrong time.`);
                }
            }
        } else {
            console.warn('Invalid data format. Field "attendances" is missing or not an array.');
        }
    } catch (error) {
        console.error('Error processing message:', error.message);
        console.error(error.stack); 
    }
});


client.on('error', (err) => {
    console.error('Error connecting to MQTT:', err.message);
});


