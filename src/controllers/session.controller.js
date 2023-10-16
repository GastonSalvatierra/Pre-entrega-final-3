import userModel from '../services/dao/db/models/user.js';
import { isValidPassword , createHash } from '../utils.js';
import SessionDto from '../services/dto/session.dto.js';





export const userRegister = async (req, res) => {
    const { first_name, last_name, email, age, password, role, cart } = req.body;
    console.log("Registrando user");
    console.log(req.body);

    const exists = await userModel.findOne({ email })
    if (exists) {
        return res.status(400).send({ status: 'error', message: 'usuario ya existe' })
    }
    const user = {
        first_name,
        last_name,
        email,
        role,
        age,
        password: createHash(password),
        cart
    }
    if (role === "") {
        user.role = "user";
    }
    const result = await userModel.create(user);
    res.send({ status: "success", message: "Usuario creado con exito con ID: " + result.id })
}




export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })//Ya que el password no está hasheado, podemos buscarlo directamente

    console.log(email , password);

    if (!user) return res.status(401).send({ status: "error", error: "Incorrect credentials" })

    if(!isValidPassword(user,password)) {
        return res.status(401).send({ status: "error", error: "Incorrect credentials" });
    }

    // damos de alta la session
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user._id
    }
    console.log(req.session.user);
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
}




export const userSession = async (req, res) => {

    if (req.session && req.session.user) {

        const sessionDto = new SessionDto (req.session.user);

        res.send(`Datos de la sesión actual: ${JSON.stringify(sessionDto.role)}`);
      } else {
        res.status(401).send('No hay una sesión activa');
      }
}


export const confirmRole = async (req, res, next) => {
    if (req.session && req.session.user) {
      const sessionDto = new SessionDto(req.session.user);
      const result = JSON.stringify(sessionDto.role);
  
      if (result !== "admin") {
        next();
      } else {
        res.status(403).send('No tienes permiso para acceder a esta ruta');
      }
    } else {
      res.status(401).send('No tenes acceso a este servicio');
    }
  };






