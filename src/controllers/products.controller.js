import productService from '../services/dao/db/products.services.js';
import ProductsDto from '../services/dto/products.dto.js';

const productServices = new productService();




//PETICIONES GET 

export const getProductsLimit = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        let products;
    
        if (req.query.filter === 'vehiculo') {
          products = await productServices.getProducts("vehiculo");
        } else if (req.query.sort === '') {
          products = await productServices.getPrices();
        } else {
          products = await productServices.getLimit(limit);
        }
    
        console.log(products);
        res.status(201).send(products);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "No se pudieron obtener los productos." });
      }
}




export const getProductsPage = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let user = await productServices.getName(req.session.user.email);
        console.log(user);
        
        let products = await productServices.getPage(page);
        
        console.log(products);
        
        if (req.session.user.role !== 'admin') {
          res.render('products', {
            isValid: true,
            user: user.first_name,
            email: user.email,
            docs: products.docs,
            hasPrevPage: products.hasPrevPage,
            prevLink: `/api/products/pages/${products.prevPage}`,
            page: products.page,
            hasNextPage: products.hasNextPage,
            nextLink: `/api/products/pages/${products.nextPage}`
          });
        }else{
          res.render('admin');
        } 
        
      } catch (error) {
        console.error(error);
        res.status(500).send({message: "No se pudieron obtener los productos."});
      }
}


//PETICIONES POST

export const postProducts = async (req, res) => {
    // Aquí deberías destruir la sesión del usuario
    req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
        } else {
          // Redirige al usuario a la página de inicio de sesión después de destruir la sesión
          res.redirect('/');
        }
      });
}



//CORRESPONDE A LA ENTREGA ANTERIOR


export const getProductsLimit10 = async (req, res) => {
    const limit = req.query.limit || 10;
    try {
        let carts = await productServices.getAll(limit);
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "No se pudo obtener los estudiantes."});
    }
}




export const postProductsSave = async (req, res) => {
    const productDto = new ProductsDto(req.body)
    try {
        let result = await productServices.save(productDto);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "No se pudo guardar el producto, complete todos los campos."});
    }
}




export const putProducts = async (req, res) => {
  const productIdToUpdate = req.params.pid;
  const updateFields = req.body;

  try {
      const updatedProduct = await productServices.updateById(productIdToUpdate, updateFields);
      res.send(updatedProduct);
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "No se pudo actualizar el producto." });
  }
}



export const deleteProducts = async (req, res) => {
    const deleteProductId = req.params.pid;

    try {
        const updatedProduct = await productServices.deleteById(deleteProductId);
        res.send(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "No se pudo actualizar el producto." });
    }
}
