let cart = [];
let modalQt = 1;
let modalKey =0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

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
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
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
    closeModal();
});
