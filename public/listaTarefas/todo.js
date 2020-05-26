//Criando um array chamado data

let data = [];

function renderTodo(){
    //limpa o que ja existe e add a nova tarefa, renderizando tudo de novo, ja com a nova tarefa. 
    document.querySelector('.todo').innerHTML = '';

    //para cada elemento do array, criar uma tarefa "task".
    data.forEach( task => {

        //cria um elemento chamdado li no html (uma lista)
        let li = document.createElement('li');

        //add ao elemento li, um template com inputs do tipo checkbox, com label.
        li.innerHTML = `
            <input type= "checkbox" id="task-${task.id}"> 
            <label for="task-${task.id}">${task.title}</label>
            <button type= "button">x</button>
        ` ;

        //do elemento "li", selecionar o elemento input e add o evento change a cada um deles. 
        li.querySelector('input').addEventListener("change", e => {

            //se o alvo tiver sido marcado. add a class complete do css
            if (e.target.checked){
                li.classList.add('complete');
            }
            //senao remove complete
            else{
                li.classList.remove('complete');
            }

        });
        
        //selecionar de li, o buton e add um evento a ele. 
        li.querySelector('button').addEventListener("click", e =>{

            // pega o alvo do evento que é o button, acha o pai dele atraves do parentNode 
            // seleciona da li o input e do input o id dele, para que saiba exatamente qual input irá ser apagado
            // com o split, transformar a string em um array e "cortar" exatamente no ponto que esta entre parenteses, pegando o elemento da posiçao q está entre colchetes
            //task-"${task.id}". o que esta entre aspas é o elemento 1 do array e é justamente o que indica o numero do id.

            //let todoId = (e.target.button.parentNode.querySelector('input').id.split('-')[1]); ou:
            let button = e.target;
            let li = button.parentNode;
            let input = li.querySelector('input');
            let id = input.id;
            let idArray = id.split('-');
            let todoId = idArray[1];
            let title = li.querySelector('label').innerText; 

            if(confirm(`Deseja realmente excluir a tarefa ${title}?`)){

                //o array data sera filtrado e ira receber uma tarefa de retornar tudo que tiver id diferente do id de todoId.
                data = data.filter(task => task.id !== parseInt(todoId));

                //vai renderizar tudo de novo com o item do id escolhido tendo sido apagado. 
                renderTodo();

            }
           
        });

        // add à classe todo no html , a li. 
        document.querySelector('.todo').append(li);

});

}

//selecionar o elemento com id=new-task do html. add o evento keyup e caso ele seja igual a tecla enter, ira pegar o seu valor.
document.querySelector("#new-task").addEventListener("keyup", e =>{

    if( e.key === "Enter"){
       
       data.push({
           //length é igual o tamanho do array, entao para add +1 tarefa o id dela deve ser length+1. 
           id: data.length+1, 
           title: e.target.value
       });

       e.target.value = "";
       //toda vez que uma nova tarefa for add na lista, a funçao sera chamada de novo, fazendo o foreach ja com a nova funçao add..
       renderTodo();
    }
});

//toda vez que a lista for carregada de primeira a funçao sera chamada, fazendo o foreach.
renderTodo();
