import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const saltRounds = 10; // Количество раундов соли
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Хеш пароля:', hashedPassword);
};

hashPassword('mirek_admin');
