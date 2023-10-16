import {cartService} from '../services/factory.js'
import CartDto from '../services/dto/Carts.dto.js';


export const getCart = async (req, res) => {
    try {
        let carts = await cartService.getAll();
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener el carrito."});
    }
}





export const getCartId = async (req, res) => {
    try {
        let cartId = req.params.cid;

        if (!cartId) {
            return res.status(400).send({ message: "El parámetro cid es inválido" });
          }
        
        let carts = await cartService.updateCartPopulate(cartId);
        res.send(carts);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener el carrito."});
    }
}

export const cartPurchase = async (req, res) => {

    try {
        let products = req.body;
        console.log(products);

        if (!products) {
            return res.status(400).send({ message: "El parámetro es inválido" });
          }
        
        if (req.body.products[0].product[0].stock <= 0) {
            return res.status(400).send({ message: "No hay suficiente stock" });
        }
        
        let confirm = await cartService.generateTicket(req.body.products[0].product[0]);
        res.status(201).send({ message: "Producto comprado con éxito", payload: confirm });


    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "Hubo un error en la operacion."});
    }
}




export const postCart = async (req, res) => {
    const cartDto = new CartDto (req.body)
    if (!cartDto) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    
    try {
        let result = await cartService.save(cartDto);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo guardar el carrito."});
    }
}





export const deleteCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    if (!cartId || !productId) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }

    try {
        let result = await cartService.deleteCart(cartId, productId);
        res.status(201).send("producto eliminado correctamente");

    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo eliminar el carrito."});
    }
}





export const deleteCartId = async (req, res) => {
    const cartId = req.params.cid 
    if (!cartId) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    

    try {
        let result = await cartService.deleteAll(cartId);
        res.status(201).send("productos eliminados correctamente");
        console.log(result);

    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudieron eliminar los productos."});
    }
}





export const putCart = async (req, res) => {
    const cartId = req.params.cid;
    const updateProducts = req.body;
    if (!cartId || !updateProducts) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    
    try {
        let result = await cartService.updateAll(cartId, updateProducts);
        res.status(201).send("carrito actualizado con exito");
        console.log(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo actualizar el carrito."});
    }
}





export const putCartPid = async (req, res) => {
   const cartId = req.params.cid;
    const productId = req.params.pid;
    const {quantity} = req.body;

    if (!cartId|| !productId ||!quantity) {
        return res.status(400).send({ message: "El parámetro cid es inválido" });
      }
    

    try {
        console.log(quantity);
        let result = await cartService.updateQuantity(cartId,productId,quantity);
        res.status(201).send("cantidad actulizada con exito");
        console.log(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo guardar el carrito."});
    }
}




