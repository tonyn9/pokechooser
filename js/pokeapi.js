var baseUrl = "https://pokeapi.co";
var pkmnv2Url = "/api/v2/pokemon/";
var api = "api";
var version = "v2";
var resources = {
    "pokedex":"pokedex",
    "pokemon":"pokemon",
    "type":"type",
    "move":"move",
    "ability":"ability",
    "egg":"egg",
    "description":"description",
    "sprite":"sprite",
    "game":"game"
};
var id = "1";
var curPokemon = "";
var amount = "";

var loading = [];

var Number2Types = new Array();

function main()
{
	
    // enableConsole(400);
    populateSelectorFromApi("/api/v2/pokemon/?limit=811");
    
 	//load moves
	populateMoveSelectorFromApi("/api/v2/move/?limit=639");
	
	//load types into an array
	populateTypesFromApiToArray("/api/v2/type")
	
	settextinputs();
	
	//display pokemon table
	$("#pokeSearchButton").click(function()
	{
         $(".header-content2").css("display", "block"); 
        curPokemon = $("#pokeSelector option:selected").text();
		displayPokemonFromApi(curPokemon);
		/* console.log("After display API " + curPokemon); */
        updateSearchButton();
    });
	
	//display options
	$("#MoreSearchButton").click(function()
	{
		$(".header-content2").css("display", "none");
         document.getElementById("form1").style.visibility = "visible"; 
		 
    });
	
	//search
	$("#pokeFindButton").click(function()
	{
         $(".header-content2").css("display", "block");
		 document.getElementById("form1").style.visibility = "hidden";
		 startSearch();
    });
	
	$("#pokeSelector").change(function()
    {
        updateSearchButton();
    });
	
	/* console.log("test"); */
	$('#poketable tbody').on('click', 'tr', function() {
		var pokelink = $(this).find("a");
		pokelink.attr("target", "_blank");
		window.open(pokelink.attr("href"));
		/* window.location.href = $(this).find("a").attr("href"); */
	});
}

	var LocalPokemon = [];
	
	var GlobalContent = "";

function settextinputs(){
	$('#S_HP').val('0');
	$('#S_Atk').val('0');
	$('#S_Def').val('0');
	$('#S_SpA').val('0');
	$('#S_SpD').val('0');
	$('#S_Spe').val('0');
	$('#S_Total').val('0');
}
	
function startSearch(){
	GlobalContent = "";
	
	startLoading("Search");
	/* console.log("starting search"); */
	
	var start;
	if ($('#Start').val() < 2 || $('#Start').val() == ""){
		start = 1;
	}else{start = $('#Start').val()};
	
	var end;
	if ($('#End').val() < start || $('#End').val() == ""){
		end = 25;
	}else{
		if ($('#End').val() > 811){
			end = 811;
		}else{
			end = $('#End').val();
		}
		};
	
	console.log(start + " " + end);
	
	end++;
	/* console.log(start);
	console.log(end); */
	
	for (var i = start; i < end; i++){
		console.log(i + " " + end);
		var Content = "";
		
			$.getJSON(baseUrl + pkmnv2Url + i, function(data){
				var tf = false;
				
				tf = CheckType(data);
				
				if (tf == false){
					return "";
				}
				
				tf = CheckMove(data);
				
				if (tf == false){
					return "";
				}
				
				tf = CheckStat(data);
				
				if (tf == false){
					return "";
				}
				
				Content = AddRow(Content, data);
				GlobalContent += Content;
			$('#poketable tbody').html(GlobalContent); 
				});
				

	}
	
	loadingComplete("Search");
}
	
function CheckMove(pkmn){
	
	/* console.log("Checking moves"); */
	
	var Move = $("#MoveSet option:selected").text();
	/* console.log(Move); */
	if (Move == ""){
		return true;
	}else{
		
		for(var i = 0; i < pkmn.moves.length; i++){
			if ( pkmn.moves[i].move.name == Move){
				return true;
			}
		}
		
	}
	return false;
	
}	
	
function CheckType(pkmn){
	/* console.log(pkmn); */
	var Type = $("#Typing option:selected").text();
	if (Type == ""){
		return true;
	}else{
		
		if (pkmn.types.length == 1){
			if(Type == pkmn.types[0].type.name){
				return true;
			}
		}else{
			if(Type == pkmn.types[0].type.name || Type == pkmn.types[1].type.name){
				return true;
			}
		}
		
	return false;
	}
}

function CheckStat(pkmn){
	
	//get stat values entered
	var h = $("#S_HP ").val();
	var a = $("#S_Atk ").val();
	var d = $("#S_Def ").val();
	var spa = $("#S_SpA ").val();
	var spd = $("#S_SpD ").val();
	var sp = $("#S_Spe ").val();
	var t = $("#S_Total ").val();
	
	/* console.log(pkmn.stats[0].base_stat); */
	
	var total = pkmn.stats[0].base_stat + pkmn.stats[1].base_stat + pkmn.stats[2].base_stat;
	total += pkmn.stats[3].base_stat + pkmn.stats[4].base_stat + pkmn.stats[5].base_stat;
	
	if (t <= total && h <= pkmn.stats[5].base_stat && a <= pkmn.stats[4].base_stat
		&& d <= pkmn.stats[3].base_stat && spa <= pkmn.stats[2].base_stat
		&& spd <= pkmn.stats[1].base_stat && sp <= pkmn.stats[0].base_stat){
		return true;
	}
	else{
		console.log("is false");
		return false;
	}
	
	
}

function AddRow(Content, p){
	 /* console.log(p);  */
	var c = "";
	
	var id = p.id;
	var sprite =  "<img src=\"https://raw.githubusercontent.com/phalt/pokeapi/master/data/v2/sprites/pokemon/" +id+ ".png\">";
	var name = p.name;
	
	var types = [];
	if (p.types.length == 1){
		/* console.log(p.types[0].type.name); */
		types.push(p.types[0].type.name);
	}else{
		/* console.log("2 types"); */
		types.push(p.types[0].type.name);
		types.push(p.types[1].type.name);
	}
	
	var ability = [];
	for (var i = 0; i < p.abilities.length; i++){
		ability.push(p.abilities[i].ability.name);
	}
	
	//there should be 6 stats
	//the order for stats is speed, spd, spa, def, atk, hp
	var stats = [];
	for (var i = 0; i < p.stats.length; i++){
		stats.push(p.stats[i].base_stat);
	}
	
	c += "<tr><td>" + sprite + "</td>"; //sprite
	c += "<td>" + id + "</td>"; //id
	c += "<td>" + name + "</td>"; //name
	
	//types
	c += "<td>";
	for (var i = 0; i < types.length; i++){
		c += types[i] + "<br>";
	}
	c += "</td>";
	
	//abilities
	c += "<td>";
	for (var i = 0; i < ability.length; i++){
		c += ability[i] + "<br>";
	}
	c += "</td>";
	
	var total = 0;
 	//total stats -- need to reverse it
	for (var i = 0; i < stats.length; i++){
		 total +=  stats[i];
	}  
	
	var href = "https://www.smogon.com/dex/xy/pokemon/" + name;
	
	c += "<td>" + stats[5] + "</td>"; //hp
	c += "<td>" + stats[4] + "</td>"; //atk
	c += "<td>" + stats[3] + "</td>"; //def
	c += "<td>" + stats[2] + "</td>"; //spa
	c += "<td>" + stats[1] + "</td>"; //spd
	c += "<td>" + stats[0] + "</td>"; //atk
	c += "<td>" + total + "</td>"; //total
	
	c += "<td><a href=" + href + "></a></td>";
	
	
	c += "</tr>";
	
	return c;
}	

function displayPokemon(pkmn){
	/* console.log(pkmn);  */ 
	/* console.log(pkmn.name);
	console.log(pkmn.id); */
	/* console.log(pkmn.types); */
	
	var content = '';
	
	var id = pkmn.id;
	var sprite =  "<img src=\"https://raw.githubusercontent.com/phalt/pokeapi/master/data/v2/sprites/pokemon/" +id+ ".png\">";
	var name = pkmn.name;
	
	var types = [];
	if (pkmn.types.length == 1){
		/* console.log(pkmn.types[0].type.name); */
		types.push(pkmn.types[0].type.name);
	}else{
		/* console.log("2 types"); */
		types.push(pkmn.types[0].type.name);
		types.push(pkmn.types[1].type.name);
	}
	
	var ability = [];
	for (var i = 0; i < pkmn.abilities.length; i++){
		ability.push(pkmn.abilities[i].ability.name);
	}
	
	//there should be 6 stats
	//the order for stats is speed, spd, spa, def, atk, hp
	var stats = [];
	for (var i = 0; i < pkmn.stats.length; i++){
		stats.push(pkmn.stats[i].base_stat);
	}
	
	content += "<tr><td>" + sprite + "</td>"; //sprite
	content += "<td>" + id + "</td>"; //id
	content += "<td>" + name + "</td>"; //name
	
	//types
	content += "<td>";
	for (var i = 0; i < types.length; i++){
		content += types[i] + "<br>";
	}
	content += "</td>";
	
	//abilities
	content += "<td>";
	for (var i = 0; i < ability.length; i++){
		content += ability[i] + "<br>";
	}
	content += "</td>";
	
	var total = 0;
 	//total stats -- need to reverse it
	for (var i = 0; i < stats.length; i++){
		 total +=  stats[i];
	}  
	
	var href = "https://www.smogon.com/dex/xy/pokemon/" + name;
	
	content += "<td>" + stats[5] + "</td>"; //hp
	content += "<td>" + stats[4] + "</td>"; //atk
	content += "<td>" + stats[3] + "</td>"; //def
	content += "<td>" + stats[2] + "</td>"; //spa
	content += "<td>" + stats[1] + "</td>"; //spd
	content += "<td>" + stats[0] + "</td>"; //atk
	content += "<td>" + total + "</td>"; //total
	
	content += "<td><a href=" + href + "></a></td>";
	
	
	content += "</tr>";
	
	
	/* console.log(stats); */
	
	$('#poketable tbody').html(content); 
	
	/* console.log("loading complete"); */
	loadingComplete("pokemon");
	
}


function displayPokemonFromApi(uri)
{
    startLoading("pokemon");
	/* var test = uri;
	console.log(test); */
    $.getJSON(baseUrl + pkmnv2Url + uri, function(data){displayPokemon(data);});
}

function populateTypes(type){
	
	var init = "";
	Number2Types.push(init);
	
	for (var i = 0; i < type.results.length -2; i++)
    {
        var opt = $("<option>").attr("value", "/" + type.results[i].uri);
		
        opt.text(type.results[i].name);
		
		Number2Types.push(type.results[i].name);
		
        $("#Typing").append(opt);
    }
	
	/* console.log(Number2Types); */
    loadingComplete("Types");
	
}

function populateTypesFromApiToArray(uri){
	startLoading("Types");
	$.getJSON(baseUrl + uri, function(data){populateTypes(data);});
}

function populateSelector(pokedex)
{
	
	/* console.log (pokedex); */
	
    // Sort the pokemon names alphabetically since they come in in no
    // particular order in the API, and there is no number associated
    // with each entry.
    
    
    pokedex.results.sort(function(a, b){
        return a.name.localeCompare(b.name);
    });
	
	amount = pokedex.results.length;
	
    for (var i = 0; i < pokedex.results.length; i++)
    {
        var opt = $("<option>").attr("value", "/" + pokedex.results[i].uri);
		
        opt.text(pokedex.results[i].name);
		
		LocalPokemon.push(pokedex.results[i].name);
		
        $("#pokeSelector").append(opt);
    }
	
    loadingComplete("pokedex");
}

function populateSelectorFromApi(uri)
{
	
    startLoading("pokedex");
    $.getJSON(baseUrl + uri, function(data){populateSelector(data);});
}

function populateMoveSelector(MoveSets)
{
	
	
    // Sort the pokemon names alphabetically since they come in in no
    // particular order in the API, and there is no number associated
    // with each entry.
    
    
    MoveSets.results.sort(function(a, b){
        return a.name.localeCompare(b.name);
    });
	
	
	
    for (var i = 0; i < MoveSets.results.length; i++)
    {
        var opt = $("<option>").attr("value", "/" + MoveSets.results[i].url);
        opt.text(MoveSets.results[i].name);
		//console.log(opt.text(MoveSets[i].name));
        $("#MoveSet").append(opt);
    }
	
	
	
    loadingComplete("move");
}

function populateMoveSelectorFromApi(uri)
{
	startLoading("move");
    $.getJSON(baseUrl + uri, function(data){populateMoveSelector(data);});
}

function startLoading(item)
{
	
    loading.push(item);
    $("#pokeSearchButton").text("Loading..."); 
    updateSearchButton();
}

function loadingComplete(item)
{
     var i = loading.indexOf(item);
    if (i != -1)
        loading.splice(i, 1);
    if (loading.length === 0)
    {
        $("#pokeSearchButton").text("Select");
    	updateSearchButton();
		$("#pokeSearchButton").prop("disabled", false); 
    } 
}

function updateSearchButton()
{
     if (loading.length !== 0
        || $("#pokeSelector option:selected").text() === curPokemon)
    	$("#pokeSearchButton").prop("disabled", true);
    else
    	$("#pokeSearchButton").prop("disabled", false); 
}


$(document).ready(main);