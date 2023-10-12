import messageModel from "../models/db/message.js"

export default class messageService{
    
    save = async (product) => {
        let result = await messageModel.create(product);
        return result;
    }

}

