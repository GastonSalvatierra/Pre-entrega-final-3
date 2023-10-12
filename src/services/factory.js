
import config from "../config/config";
import MongoSingleton from '../config/mongodb-singleton.js'



async function initializeMongoService() {
    console.log("Iniciando servicio para MongoDB");
    try {
        // conectamos Mongo
        await MongoSingleton.getIntance()

        // Creamos las instancias de las Clases de DAO de Mongo
        const { default: CoursesServiceMongo } = await import('./dao/db/courses.service.js');
        coursesService = new CoursesServiceMongo();
        console.log("Servicio de courses cargado:");
        console.log(coursesService);

        const { default: StudentServiceMongo } = await import('./dao/db/students.service.js');
        studentService = new StudentServiceMongo();
        console.log("Servicio de estudiantes cargado:");
        console.log(studentService);


    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}


switch (config.persistence) {
    case 'mongodb':
        initializeMongoService();
        break;

    case 'files':
        //FILES     

    case 'sql':
        // SQL

        break;

    default:
        console.error("Persistencia no válida en la configuración:", config.persistence);
        process.exit(1); // Salir con código de error
}