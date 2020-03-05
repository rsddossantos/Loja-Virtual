let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);
let atualPrice = 0;

// Listagem das pizzas
pizzaJson.map((item, index)=>{
   let pizzaItem = c('.models .pizza-item').cloneNode(true);
   pizzaItem.setAttribute('data-key', index);
   pizzaItem.querySelector('.pizza-item--img img').src = item.img;
   pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
   pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
   pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
   pizzaItem.querySelector('a').addEventListener('click',(e)=>{
      e.preventDefault();
      // qual a pizza
      let key = e.target.closest('.pizza-item').getAttribute('data-key');
      modalQt = 1;
      modalKey = key;
      c('.pizzaBig img').src = pizzaJson[key].img;
      c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      c('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price;
       atualPrice = c('.pizzaInfo--actualPrice').innerHTML;
      c('.pizzaInfo--size.selected').classList.remove('selected');
      cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
         if(sizeIndex == 2) {
            size.classList.add('selected');
         }
         size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      });
      c('.pizzaInfo--qt').innerHTML = modalQt;
      c('.pizzaWindowArea').style.opacity = 0;
      c('.pizzaWindowArea').style.display = 'flex';
      setTimeout(()=>{
         c('.pizzaWindowArea').style.opacity = 1;
      }),200;
   })
   c('.pizza-area').append( pizzaItem );
});

//Eventos do MODAL
function closeModal(){
   c('.pizzaWindowArea').style.opacity = 0;
   setTimeout(()=>{
      c('.pizzaWindowArea').style.display = 'none';
   }, 500);
}
    //fechar modal ao cancelar
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
   item.addEventListener('click',closeModal);
});
    //fechar modal ao clicar fora dele
c('.pizzaWindowArea').addEventListener('click',function(e){
  if(e.target == this) closeModal();
});
    //ação da quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
    totalModal =  atualPrice * modalQt;
    c('.pizzaInfo--actualPrice').innerHTML = totalModal.toFixed(2);
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    totalModal =  atualPrice * modalQt;
    c('.pizzaInfo--actualPrice').innerHTML = totalModal.toFixed(2);
});
    //selecionando tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
    //carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    // Criando identificador para agrupar mesma pizza e tamanho.
    let identifier = pizzaJson[modalKey].id+'@'+size;
    // Caso encontrar um identificador igual nesse laço ele só incrementa a Qtde, senão ele cria um novo item no carrinho
    let key = cart.findIndex((item)=>item.identifier == identifier);
    if (key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

// Exibição carrinho de compras
function updateCart() {
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            // Incremento da quantidade + e - no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                // o update irá fazer aplicar os valores setados
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });
            //exibindo na tela o item
            c('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else{
        c('aside').classList.remove('show');
    }
}















