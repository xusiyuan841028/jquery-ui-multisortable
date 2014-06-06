function SortableCTRL($scope) {
    var sortableEle;
    
    $scope.sortableArray = [
        'One', 'Two', 'Three'
    ];
    
    $scope.add = function() {
        $scope.sortableArray.push('Item: '+$scope.sortableArray.length);
        sortableEle.refresh();
    }
    
    $scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
    }
    $scope.dragEnd = function(e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();
        
        //console.log(start, end);
        $scope.sortableArray.splice(end, 0, 
            $scope.sortableArray.splice(start, 1)[0]);
        
        $scope.$apply();
    }
        
    sortableEle = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    }).disableSelection();
    
    
}

var sortableElm = $('.list').multisortable().disableSelection();
'activate beforeStop change create deactivate out over receive remove start stop update click'.split(' ').forEach(function(event){
				sortableElm.on('multisort' + event, function(event){
				     
						console.log(event.type, arguments);
				});
		});


