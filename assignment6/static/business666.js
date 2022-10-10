$(function(){
    let business = [];
    let original = [];
    let status = '';
    let loc = ""
    $("#checkbox")[0].onchange = (e) => {
        let location = $('#location')[0];
        location.disabled = e.target.checked;
        if(e.target.checked) {
                $.get('https://ipinfo.io/json?token=76d72ea168af96', function(data) {
                console.log('Response', data["loc"]);
                loc = data["loc"];
                location.value = ""
            });
        }
        location.setAttribute('required', !e.target.checked)
    };

    $("#search-form")[0].onsubmit = (e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/business',
            data: JSON.stringify({
                term: $("#keyword")[0].value,
                radius: $("#Distance")[0].value,
                location: $("#location")[0].value || loc,
                categories: $("#Category")[0].value
            }),
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                business = data.businesses;
                displayBusiness();
                setTimeout(()=> {window.location.href = "#menu";},100);
            },
            error: () => {
                business = [];
                displayBusiness();
                setTimeout(()=> {window.location.href = "#menu";},100);
            },
            dataType: 'json'
        });
        console.log($("#location")[0].value)
        $("#details")[0].classList.add('hidden');
        
    }

    $("#clear").click((e) => {
        e.preventDefault();
        $("#keyword")[0].value = "";
        $("#Distance")[0].value = "10";
        $("#location")[0].value = "";
        $("#Category")[0].value = "all";

        $("#nofound")[0].classList.add('hidden');
        $("#menu")[0].classList.add('hidden');
        $("#details")[0].classList.add('hidden');
    })

    function displayBusiness() {
        if (business.length == 0) {
            $("#nofound")[0].classList.remove('hidden');
            $("#menu")[0].classList.add('hidden');
        } else {
            $("#nofound")[0].classList.add('hidden');
            $("#menu")[0].classList.remove('hidden');
            let menu = $("#menu-content")[0];
            let content = "";
            business.forEach((b, idx) => {
                content += `
                    <tr>
                        <td> ${idx + 1} </td>
                        <td> 
                            <img style="width:120px;height:120px" src="${b.image_url}"/>
                        </td>
                        <td> <a class="show" href="#details" onclick="showDetail('${b.id}')">${b.name}</a></td>
                        <td> ${b.rating}</td>
                        <td>${Math.floor(b.distance / 1609.344 * 10) / 10}</td>

                    </tr>
                `
                menu.innerHTML = content;
            })
        }
    }

    function sort_by(fn) {
        business.sort(fn);
        console.log(business);
        displayBusiness();
    }

    $("#header_businessname").click(
        () => {
            if (status === 'asec') {
                sort_by(
                    (a,b)=> {
                        return b.name.localeCompare(a.name);
                    })
                status = 'desc';
            } else if (status === 'desc') {
                business = original;
                displayBusiness();
                status = '';
            } else {
                original = JSON.parse(JSON.stringify(business));
                sort_by(
                    (a,b)=> {
                        return a.name.localeCompare(b.name);
                    })
                status = 'asec';
            }
        }
    )
    $("#header_rating").click(
        () => {
            if (status === 'bra') {
                sort_by(
                    (a,b)=> {
                        return b.rating - a.rating;
                    })
                status = 'ara';
            } else if (status === 'ara') {
                business = original;
                displayBusiness();
                status = '';
            } else {
                original = JSON.parse(JSON.stringify(business));
                sort_by(
                    (a,b)=> {
                        return a.rating - b.rating;
                    })
                status = 'bra';
            }
        }
    )
    
    $("#header_distance").click(
        () => {
            if (status === 'sss') {
                sort_by(
                    (a,b)=> {
                        return a.distance - b.distance;
                    })
                status = 'lll';
            } else if (status === 'lll') {
                business = original;
                displayBusiness();
                status = '';
            } else {
                original = JSON.parse(JSON.stringify(business));
                sort_by(
                    (a,b)=> {
                        return b.distance - a.distance;
                    })
                status = 'sss';
            }
        }
    )
    // $("#header_rating").click(()=>sort_by(
    //     (a,b)=> {
    //         return b.rating - a.rating;
    //     }
    // ))
    // $("#header_distance").click(()=>sort_by((a,b)=> a.distance - b.distance))
})

function showDetail(id) {
    let details = $("#details")[0];
    details.classList.remove("hidden")
    $.ajax({
        type: 'get',
        url: '/details/' + id,
        success: (data)=> {
            console.log(data);

            $("#detail-title")[0].innerText = data.name;
            $("#detail-category")[0].innerText = data.categories.map(x => x.title).join('｜');
            $("#detail-address")[0].innerText = data.location.display_address[0] + ','+data.location.city + ',' +  data.location.state + ' ' + data.location.zip_code + ' ';
            $("#detail-phone")[0].innerText = data.display_phone;
            $("#detail-transactions")[0].innerText = data.transactions.join(',');
            $("#detail-price")[0].innerText = data.price;
            $("#detail-info")[0].innerHTML = '<a target="_blank" href="' + data.url + '">Yelp</a>'


            let content = "";
            data.photos.forEach((b, idx) => {
                content += ` 
                <div style="margin-left: 4px; margin-right: 4px; border: gray 1px solid">
                    <img class="abc" src="${b}"/>
                </div>
                `

                $("#detail-images")[0].innerHTML = content;
            })
            
            if(data.hours[1].is_open_now) {
                $("#detail-status")[1].innerText = "Open now";
                $("#detail-status")[1].classList.add("open-now");
                $("#detail-status")[1].classList.remove("closed");
            } else {
                $("#detail-status")[1].innerText = "Closed";
                $("#detail-status")[1].classList.add("closed");
                $("#detail-status")[1].classList.remove("open-now");
            }
        },
        
    });
}