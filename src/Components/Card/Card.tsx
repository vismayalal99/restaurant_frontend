import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./Card.css";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartQuantityDecrement, cartQuantityIncrement, fetchCartData } from "../../Components/Action/api";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../Action/api";
import { toast } from "react-toastify";




const useStyles = makeStyles({
  root: {
    minWidth: 270,
    padding: "10px 10px",
  },
  formControl: {
    minWidth: 120,
  },
  btndcr:{
    border: "none",
     backgroundColor: "none",
     padding: "5px",
    borderRadius: "50%",
  },
  btnincr:{
    border: "none",
    backgroundColor: "none",
    padding: "5px",
    borderRadius: "50%",
  },
  qnty:{
    border: "1px solid gray",
    width: "60px",
    display: "flex",
    padding: "5px",
    borderRadius: "15px",
  }
});

interface cardProps {
  datas: any;

}

function Cards(props: cardProps) {
  
  const classes = useStyles();
  const { datas } = props;
  console.log("total menu",datas);
  
  const dispatch = useDispatch();

  const [quantity, setQuentity] = React.useState<any>(1);

  const cartData = useSelector((state: any) => state.cartData);
  
  React.useEffect(() => {
    dispatch<any>(fetchCartData());
    console.log('hi');
    
  }, []);

  const constUrl = "http://localhost:7000/images/";
  

  const quantityIncrement = () => {
    setQuentity(quantity < datas.quantities ? quantity + 1 : quantity );
    if(quantity == datas.quantities ){
    toast.error("out of stock", {
      position: toast.POSITION.TOP_CENTER
  })
  }
  };

  const quantityDecrement = (id: any) => {
    setQuentity(quantity > 1 ? quantity - 1 : 1);
  };



  return (
    <>
      <div style={{ justifyContent: "space-between", padding: "0 15px",marginBottom:'25px' }}>
       
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt=""
              height="140"
              image={constUrl + datas.image}
              title="image"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {datas.name}
              </Typography>
              <Typography variant="h6" component="h3">
                ₹ {datas.price}/-
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            
            {(function () {
              var match = false;
              const item = cartData.data.map((i: any) => i.name);
              for (let i = 0; i <= item.length - 1; i++) {
             
                var x = item[i];
                if (x == datas.name) {
                  match = true;
                  break;
                }
              }
              if (match) {
                const qn= cartData.data.find((obj:any) => obj.menu_id == datas.id )
             console.log(qn);
             
                return (
                  <>
                   <>
                    <div className={classes.qnty}>
                      <button className={classes.btndcr} onClick={()=>{dispatch<any>(cartQuantityDecrement(qn.id,qn.quantity))}}>
                        -
                      </button>
                      <div style={{ padding: "0px 10px", width: "10px" }}>
                      { cartData.data.find((obj:any) => obj.menu_id == datas.id ).quantity}
                      </div>
                      <button className={classes.btnincr} onClick={()=>{dispatch<any>(cartQuantityIncrement(qn.id,datas.id,datas.quantities,qn.quantity))}}>
                        +
                      </button>
                    </div>
                  
                  </>
                    <Link to="/cart" style={{ textDecoration: "none" }}>
                      <Button size="small" variant="outlined" color="primary">
                        Go to Cart
                      </Button>
                    </Link>
                  </>
                );
              } else {
                return (
                  <>
                  {
                    datas.availability != 0 && datas.quantities != 0 &&

                    <div className={classes.qnty} >
                    <button className={classes.btndcr} onClick={quantityDecrement} >
                      -
                    </button>
                    <div style={{ padding: "0px 10px", width: "10px" }}>
                      {quantity}
                    </div>
                    <button  className={classes.btnincr} onClick={quantityIncrement}>
                      +
                    </button>
                  </div>
                  }
                    
                    <Button size="small" variant="contained" disabled={datas.availability == 0 || datas.quantities == 0} color="primary" 
                              onClick={() => {dispatch<any>(addToCart(datas,quantity))}}>
                      Add to Cart
                    </Button>
                  
                  </>
                 
                );
              }
            })()}
            
          </CardActions>
        </Card>
      </div>
    </>
  );
}

export default Cards;
