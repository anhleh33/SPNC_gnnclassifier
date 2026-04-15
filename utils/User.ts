export default class User {
    private Fullname;
    private Username;
    private Email;
    private Password;

    constructor(fullname: string, username: string, email: string, password: string) {
        this.Fullname = fullname
        this.Username = username
        this.Email = email
        this.Password = password
    }

    public get fullName() { return this.Fullname; }
    public get username() { return this.Username; }
    public get email() { return this.Email; }
    public get password() { return this.Password; }

    printUser = () => {
        console.log(`
            --- User Profile ---
            Full Name: ${this.Fullname}
            Username:  ${this.Username}
            Email:     ${this.Email}
            Password:  ${this.Password.replace(/./g, '*')} (Hidden for security)
            --------------------`
        );
    }
}