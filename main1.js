angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);


function mainCtrl($scope, $http){



	$scope.startMyAwesomeApp = function(){

		var Fuel = $scope.fuel.name;
		var bodyType = $scope.bodytype.name;
		var Transmission = $scope.transmission.name;
		var Price = $scope.price.name;
		var Seats = $scope.seats.name;
		

		var query = `PREFIX ex: <http://example.org/cars/> PREFIX vsso: <http://automotive.eurecom.fr/vsso#> PREFIX schema: <http://schema.org/>
		SELECT DISTINCT ?labelVaria ?labelModel ?labelBrand ?engine ?model ?price ?standard ?image WHERE {
			?car rdf:type ex:ModelVariety;
				rdfs:label ?labelVaria;				
				ex:price ?price;
				ex:seats ?seats;
				vsso:model ?model;
				ex:engineCapacity ?engine;
				vsso:fuelType ${Fuel};
				vsso:bodyType ${bodyType};
				ex:transmissionType ${Transmission};
				vsso:model ?carmodel;
				vsso:brand ?carbrand;
				ex:standardModel ?standard.
				?carmodel rdfs:label ?labelModel.
				?standard schema:image ?image.
				?carbrand rdfs:label ?labelBrand.
				FILTER(?price < ${Price})
				FILTER(?seats = ${Seats})

		} 
		`
		$scope.mySparqlEndpoint = 'http://192.168.1.71:7200/repositories/FinalProject';
		$scope.mySparqlQuery = encodeURI(query).replace(/#/g, '%23');		

		$http( {
			method: "GET",
			url : $scope.mySparqlEndpoint + "?query=" + $scope.mySparqlQuery,
			headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
		} )
		.success(function(data, status ) {
			$scope.myDynamicLabels = [];
			$scope.myDynamicData = [];


			var table = '<table class="table table-bordered">';
			$scope.Test = data.results.bindings;
			data.results.bindings.forEach(function (result){
				 table +=  '<tbody><tr><td>' + '<a class="snapchat" style="margin: 5px 5px 0 -2px;" target="_blank" href="'+result.image.value+'">' + result.labelVaria.value + '<img src="'+ result.image.value +'"/></a>' + '</td><td>' + "€ " + result.price.value + '</td><td>' + result.engine.value + 'cc' +  '</td><td>' + result.labelModel.value  +'</td><td>' + result.labelBrand.value+ /*'</td><td>' +  "<img src='"+result.minimg.value+"'style='width:200px;height:250px;'>" + */'</td></tr></tbody>';
    		})

			table += '<thead class="thead-dark"><tr><th scope="col">' + 'Models' + '</th><th scope="col">' + 'Price' + '</th><th scope="col">' + 'Engine Capacity' + '</th><th scope="col">' + 'Standard Model' + '</th><th scope="col">' + 'Brand' + /* '</th><th scope="col">' + 'Image' + */'</th></tr></thead>';
			table += '</table>';
			result.innerHTML = table;  
			console.log($scope.Test);

	

			// now iterate on the results

			
		})
		.error(function(error ){
			console.log('Error running the input query!'+error);
		});

	};
}
