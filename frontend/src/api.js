import axios from 'axios';

const API_URL = 'http://localhost:3000';


export const getCviky = async () => {
    const response = await axios.get(`${API_URL}/cviky`);
    return response.data;
};


export const getStudents = async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
};


export const addStudentToCviky = async ({ isic, first_name, last_name, cviky_id }) => {
    if (!first_name || !last_name) {
        throw new Error("Имя и фамилия обязательны для добавления студента.");
    }

    return await axios.post(`${API_URL}/students`, {
        isic,
        first_name,
        last_name,
        cviky_id,
    });
};
export const addPair = async (cvikyData) => {
    return await axios.post("http://localhost:3000/cviky", cvikyData);
};


export const updateStudentPresence = async (id, present) => {
    const response = await axios.put(`${API_URL}/students/${id}`, { present });
    return response.data;
};

export const deletePair = async (id) => {
    return await axios.delete(`${API_URL}/cviky/${id}`);
};

export const deleteAllStudents = async (cvikyId) => {
    return await axios.delete(`${API_URL}/students/cviky/${cvikyId}`);
};

export const deleteStudent = async (id) => {
    return await axios.delete(`${API_URL}/students/${id}`);
};

export const findByUserByLogin = async (login, password, role_server) => {
    const response = await axios.post(`${API_URL}/login`, { login, password, role_server });
    return response.data;
}

export const updateUserByCvikId = async (cvikyId) => {
    return await axios.get(`${API_URL}/students/cviky/${cvikyId}`);
}

export const updateAttendanceByStudentId = async (isic) => {
    return await axios.get(`${API_URL}/attendance/${isic}`);
}

export const updateAttendance = async (studentIsic, weekNumber, attended) => {
    const response = await axios.put(`${API_URL}/attendance`, {
        studentIsic,
        weekNumber,
        attended,
    });
    return response.data; 
};