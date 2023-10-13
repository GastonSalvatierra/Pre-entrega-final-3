export default class SessionDto {
    constructor(session) {
        this.name = session.first_name;
        this.email = session.email;
        this.age = session.age;
        this.role = session.role;
        
    }

}
