import bcrypt from 'bcryptjs';

const getUsers = async () => {
    return [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: await bcrypt.hash('123456', 10),
            role: 'admin',
            premium: true,
            emailVerified: true,
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: await bcrypt.hash('123456', 10),
            role: 'user',
            premium: false,
            emailVerified: true,
            academicInfo: {
                university: 'Tech University',
                major: 'Computer Science',
                graduationYear: '2024',
                gpa: '3.8',
            }
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: await bcrypt.hash('123456', 10),
            role: 'user',
            premium: true,
            emailVerified: true,
            academicInfo: {
                university: 'State College',
                major: 'Information Technology',
                graduationYear: '2025',
                gpa: '3.9',
            }
        },
    ];
};

export default getUsers;
