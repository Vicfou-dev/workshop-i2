var nb_carreau_x = Number.isInteger(x_wall / x_mat) ? x_wall / x_mat : Math.ceil(x_wall / x_mat);
var nb_carreau_y = Number.isInteger(y_wall / y_mat) ? y_wall / y_mat : Math.ceil(y_wall / y_mat);

function calcul_carreaux_row(mat, wall){
    var carreaux = [];
    var nb = Math.floor(wall / mat);
    for(var i = 0; i < nb ; i++) {
        carreaux.push({x : mat})
    }
    pad = wall - (nb * mat);
    if(pad) {
        carreaux.push({x : pad});
    }

    return {
        carreaux, pad
    };
}

function calcul_carreaux_row_eco(mat, wall, pad) {
    var carreaux = [];
    wall -= pad;
    if(pad) {
        carreaux.push({x : pad});
    }
    var nb = Math.floor(wall / mat);
    for(var i = 0; i < nb ; i++) {
        carreaux.push({x : mat})
    }
    pad = wall - (nb * mat);
    if(pad) {
        carreaux.push({x : pad});
    }

    return {
        carreaux, pad
    };
}

function calcul_carreaux_row_demi(mat, wall, pad) {
    var carreaux = [];
    if(pad) {
        carreaux.push({x : mat / 2});
        wall -= mat / 2;
    }
    
    var nb = Math.floor(wall / mat);
    for(var i = 0; i < nb ; i++) {
        carreaux.push({x : mat})
    }
    pad = wall - (nb * mat);
    if(pad) {
        carreaux.push({x : pad});
    }
    return {
        carreaux, pad
    };
}

function calcul_carreaux_row_tier(mat, wall, pad) {
    var carreaux = [];
    if(pad) {
        carreaux.push({x : mat / 3});
        wall -= mat / 3;
    }
    
    var nb = Math.floor(wall / mat);
    for(var i = 0; i < nb ; i++) {
        carreaux.push({x : mat})
    }
    pad = wall - (nb * mat);
    if(pad) {
        carreaux.push({x : pad});
    }
    return {
        carreaux, pad
    };
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

var padding_left = 0;
var padding_bottom = 0;

const cuts = [
    'decoupe_eco','decoupe_demi','decoupe_tier','no_decoupe'
];

const tabs = [];
var nb_carreau_average = (x_wall * y_wall) / (x_mat * y_mat);
var carreaux_sliced = [];
var nb_carreau_entier = 0;
for(var j = 0; j < nb_carreau_y; j++) { 
    tabs[j] = [];
    if(cut == 'decoupe_eco') {
        var res_row = calcul_carreaux_row_eco(x_mat, x_wall, padding_left);
    }

    if(cut == 'decoupe_demi') {
        var res_row = calcul_carreaux_row_demi(x_mat, x_wall, j % 2);
    }

    if(cut == 'decoupe_tier') {
        var res_row = calcul_carreaux_row_tier(x_mat, x_wall, j % 2);
    }

    if(cut == 'no_decoupe') {
        var res_row = calcul_carreaux_row(x_mat, x_wall);
    }

    for(var i = 0; i < res_row.carreaux.length; i++) {
        if( j + 1 ==  nb_carreau_y) {
            let perte = (nb_carreau_y - (y_wall / y_mat)) * y_mat;
            if(perte == 0) {
                perte = y_mat;
            }
            res_row.carreaux[i].y = perte;
        }
        else {
            res_row.carreaux[i].y = y_mat;
        }
        if(res_row.carreaux[i].y == y_mat && res_row.carreaux[i].x == x_mat) {
            nb_carreau_entier++;
        }
        else{
            //console.log("Row : " + (j + 1) + " Column : " + (i + 1));
            carreaux_sliced.push(res_row.carreaux[i]);
        }
    }

    padding_left = x_mat - res_row.pad;
    tabs[j] = res_row.carreaux;
    
}

var carreaux_sliced_sort_desc = carreaux_sliced.sort((a,b) => b - a);
var carreaux = [];

const tiles = [];
console.log(carreaux_sliced_sort_desc.length);
for(var i = 0; i < carreaux_sliced_sort_desc.length; i++) {
    if(carreaux_sliced_sort_desc[i] == null) {
        continue;
    } 

    var tile = carreaux_sliced_sort_desc[i];
    var tile_x = x_mat;
    var tile_y = y_mat;
    tile.id = i;
    var tile_tab = [tile];

    for(var j = i + 1; j < carreaux_sliced_sort_desc.length; j++) {

        if(carreaux_sliced_sort_desc[j] == null) {
            continue;
        }

        var next_tile = carreaux_sliced_sort_desc[j];
        if(tile.y == next_tile.y) {
            if(tile.x + next_tile.x <= tile_x ) {
                tile_x -= next_tile.x;
                next_tile.id = j;
                tile_tab.push(next_tile);
                carreaux_sliced_sort_desc[j] = null;
                continue;
            } 

            if(tile.x + next_tile.y <= tile_x ) {
                tile_x -= next_tile.y;
                next_tile.id = j;
                tile_tab.push(next_tile);
                carreaux_sliced_sort_desc[j] = null;
                continue;
            }
        }

        if(tile.x == next_tile.x) {
            if(tile.y + next_tile.y <= tile_y ) {
                tile_y -= next_tile.y;
                next_tile.id = j;
                tile_tab.push(next_tile);
                carreaux_sliced_sort_desc[j] = null;
                continue;
            } 

            if(tile.y + next_tile.x <= tile_y ) {
                tile_y -= next_tile.x;
                next_tile.id = j;
                tile_tab.push(next_tile);
                carreaux_sliced_sort_desc[j] = null;
                continue;
            } 
        }
    }
    tiles.push({data : tile_tab, color : getRandomColor()});
}

console.log(tiles);

document.getElementById('nb-carreau-full').innerHTML = nb_carreau_entier;
document.getElementById('nb-carreau-cut').innerHTML = tiles.length;
document.getElementById('nb-carreau-all').innerHTML = nb_carreau_entier + tiles.length;
console.log(tabs);

var unit = 50;

var scale = 25;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#0194ff';
ctx.strokeStyle = '#354052';

var padding_left = 0;
var padding_bottom = 0;

tabs.forEach((row,row_id) => {
    padding_left = 0;
    row.forEach((cell) => {
        if(cell.id != undefined) {
            for(var i = 0; i < tiles.length; i++) {
                if(tiles[i].data.find(obj => obj.id == cell.id)) {
                    ctx.fillStyle = tiles[i].color;
                    console.log(ctx.fillStyle);
                    break;
                } 
            }
        }
        ctx.beginPath();
        ctx.rect(padding_left, padding_bottom, cell.x * scale, cell.y * scale);
        padding_left += (scale * cell.x);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = '#0194ff';
       
    });
    padding_bottom += scale * row[0].y;
})

/*
const container = document.getElementById('container');
const showRoom = (x, y) => {
    console.log(x.cut);
    container.style.height = `${y.nb * unit + (y.nb * 2) + ((y.cut * unit) / y_mat)}px`;
    container.style.width = `${x.nb * unit + (x.nb * 2) + (x.cut * unit) / x_mat}px`;
    container.style.backgroundColor = 'red';
}

const showCarreau = (x, y) => {
    const div = document.createElement('div');
    div.style.width = `${x * unit}px`;
    div.style.height = `${y * unit}px`;
    div.style.backgroundColor = 'green';
    div.style.border = '1px solid';
    div.style.float = 'left';
    container.appendChild(div);
}

for(var j = 0; j < res_x.nb; j++) {
    for(var i = 0; i < res_y.nb; i++) {
        showCarreau(1,1);
    }
}

console.log(res_y.nb * 50 + res_y.nb * 2);
showRoom(res_x, res_y);*/



