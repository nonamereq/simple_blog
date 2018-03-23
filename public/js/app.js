(() => {
    const PARENT_URL='localhost:8080';
    const INDEX_URL='index';
    const ADD_URL = 'add';
    const SHOW_URL = 'show';
    let container = document.getElementById('container');

    let sendXmlHttpRequest = (url) => {
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', url);

            xmlHttp.onload = () => resolve(xmlHttp.response.trim(), xmlHttp.status);
            xmlHttp.onerror = () => reject(xmlHttp.response.trim());

            xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xmlHttp.send();
        });
    }

    let setupIndex = () => {
        let request = sendXmlHttpRequest(INDEX_URL);
        request.then((response) => {
            response = JSON.parse(response);
            if(response.links.length == 0){
                let h3 = document.createElement('h3');
                h3.textContent = 'No posts so far';
                container.appendChild(h3);
            }
            else{
                for(let i in response.links){
                    let div = document.createElement('div');
                    div.innerHTML = '<a href="show.html?q=' + response.links[i]['_id'] + '">'+
                        response.links[i].title + '</a>' + 
                        '<span>by ' + response.links[i].name + '</span>';
                    container.appendChild(div);
                }
            }
        }).catch((reason) => {
            console.log(`${reason}`);
        });
    }

    let setupAdd = () => {
    }

    let setupShow = () => {
        let request =  sendXmlHttpRequest(SHOW_URL+
            '/'+(new URL(window.location.href)).searchParams.get('q'));
        request.then((response, status) => {
            response = JSON.parse(response);
            console.log(response);
            if(!response.error){
                let element = document.createElement('h3');
                element.textContent = response.blog.title;
                container.appendChild(element);

                element = document.createElement('span');
                element.textContent = 'By: ' + response.blog.name;
                container.appendChild(element);

                element = document.createElement('div');
                element.classList="block";
                element.textContent = response.blog.blog;
                container.appendChild(element);
            }else{
                let element = document.createElement('h1');
                element.textContent = `Can't find any water here ${response.error}`
                container.appendChild(element);
            }
        });
    }

    document.body.onload = () => {
        switch(page){
            case 'index':
                setupIndex();
                break;
            case 'add':
                setupAdd();
                break;
            case 'show':
                setupShow();
                break;
        }
    }
})();
