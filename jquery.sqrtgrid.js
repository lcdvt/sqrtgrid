(function ($) 
{
    function SQRTGrid(instance, options) // class defenition
    {
        this.settings = $.extend({}, $.fn.sqrtGrid.defaults, options);
        var supergrid = $(instance);
        var	canvas = $("#myCanvas").get(0);
		var context = canvas.getContext("2d");
        var self = this;
        var cXunits = this.settings.xunits; 				// Number of units that will fit horizontally
		var cYunits = this.settings.yunits;
		var cGridSize = cXunits * cYunits; 					// Total number of units in de image grid.
		var	cNumShapes = 7;									// Number of units that will fit horizontally
		var	aBitGrid = new Array(cGridSize); 				// This array is a binary linear representation of the image grid.
		var	aShapeOrientation = new Array(cNumShapes);		// Shapes, where 0 is the smallest shape size.
		var	aShapeWidth = new Array(cNumShapes);
		var	aShapeHeight = new Array(cNumShapes);
		var	aShapeColor = new Array(cNumShapes);
		var	UnitWidth =  canvas.clientWidth / (Math.SQRT2 * cXunits);	// Calculate the unit width.
		var	UnitHeight = (canvas.clientWidth / (Math.SQRT2 * cXunits)) / Math.SQRT2; // Calculate the unit height.
		
		var imgLandscape = new Image();
		var imgPortrait = new Image();
		
        //init();

        function init() 
        {
        	console.log('init supergrid');
        	InitializeGrid();
			InitializeShapes();
			DoRectangles();
        }
		
		// Test
		imgLandscape.onload = function(){
			imgPortrait.src = "http://lh4.ggpht.com/-LIrW1Q2iCis/T3oEYMlxuXI/AAAAAAAAk-c/OWUecFqStYM/_MG_5012-2.jpg?imgmax=1280";
		};
		
		imgPortrait.onload = function(){
			init();
		};
        
		//imgLandscape.src = "http://lh6.ggpht.com/-HG8a8yDR7ik/T3oEWUQeaOI/AAAAAAAAk-Q/o3lGDbJ4TjI/_MG_5012.jpg?imgmax=1280";
		imgLandscape.src = "http://farmeu.static.viewbook.com/1/8635978_54d54b4eb82c527c86d262487e5f6c28_b.jpg"
		
        // Init Grid bit values 
        function InitializeGrid()
		{
			// Initialise the grid
			var i;
			for( i = 0; i < cGridSize; i++ )
				aBitGrid[i] = false;
		}
		
		// Init the shapes, starting with a landscape offset.
		function InitializeShapes()
		{
			var i;	
			for( i = 0; i < cNumShapes; i++ )
			{
				if( (i % 2) == 0 )
				{
					aShapeOrientation[i] = 'L';	
					if( i == 0 ) aShapeWidth[i] = aShapeHeight[i] = 1;
					else		 aShapeWidth[i] = aShapeHeight[i] = aShapeWidth[i - 1] * 2;
				}
				else
				{
					aShapeOrientation[i] = 'P';
					aShapeWidth[i] = aShapeWidth[i - 1];
					aShapeHeight[i] = aShapeWidth[i - 1] * 2;
				}
				console.log( 'Shape[' + i + '] type = ' + aShapeOrientation[i] + ' width = ' + aShapeWidth[i] + ' - height = ' + aShapeHeight[i] );
			}
		}	
		
		function DoRectangles()
		{
			var r;
			var o = GetOffSet();
					
			while( o != -1 )
			{
				var s = Math.ceil(Math.random() * cNumShapes );						
				// Try random shapes until one will fit.
				while( !WillShapeFit(o, s) )
				{
					console.log( ' !WillShapeFit = ' + s ); 
					s = Math.ceil(Math.random() * cNumShapes );
				}
				
				SetShape( o, s );
				//DrawShape( o, s );
				DrawImage( o, s );
				o = GetOffSet();
			}
		}
				
		// Get the first free unit offset
		function GetOffSet()
		{
			var i;
					
			for( i = 0; i < cGridSize; i++ )
			{
				if( aBitGrid[i] == false )	return i;
			}
			return -1;
		}
		
		// Determine if a certain shape will fit on a certain location
		function WillShapeFit( offset, shape )
		{
			var x, y;
				
			// The shape will not fitt the width, from this offset
			if( ((offset % cXunits) + aShapeWidth[shape]) > cXunits )
			{
				console.log( 'WillShapeFit offset = ' + offset + ' cXunits = ' + cXunits + ' shape = ' + shape + ' FALSE' );
				return false;
			}
			// Now check for overlapping shapes from an erlier row.
			for( y = 0; y < aShapeHeight[shape]; y++ )
			{
				for( x = 0; x < aShapeWidth[shape]; x++ )
				{
					if( aBitGrid[offset + (y * cXunits) + x] != false )	return false;
				}
			}
			return true;
		}
		
		// Mark the space in the grid as occupied.
		function SetShape( offset, shape )
		{
			var x, y;
			
			// Set the shape bits in the grid.
			for( y = 0; y < aShapeHeight[shape]; y++ )
			{
				for( x = 0; x < aShapeWidth[shape]; x++ )
				{
					aBitGrid[offset + (y * cXunits) + x] = true;		
				}
			}
		}
		
		function DrawShape( offset, shape )
		{
			var x, y, w, h;
			
			console.log( 'DrawShape offset = ' + offset + ' shape = ' + shape );
					
			y = UnitHeight * Math.floor( offset / cXunits );
			x = UnitWidth * (offset % cXunits);
			w = aShapeWidth[shape] * UnitWidth;
			h = aShapeHeight[shape] * UnitHeight;
					
			context.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
			context.fillRect(x,y,w,h);
		}
		
		function DrawImage( offset, shape )
		{
			var x, y, w, h;
			var imageObj;
			
			console.log( 'DrawImage offset = ' + offset + ' shape = ' + shape );
			
			if( aShapeOrientation[shape] == 'L' )
				imageObj = imgLandscape;
			else
				imageObj = imgPortrait;				
					
			y = UnitHeight * Math.floor( offset / cXunits );
			x = UnitWidth * (offset % cXunits);
			w = aShapeWidth[shape] * UnitWidth;
			h = aShapeHeight[shape] * UnitHeight;

			context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, x, y, w, h);
		}
    }
    $.fn.sqrtGrid = function (options) 
    {
        var collection = [];
        console.log('accessing instance');
        for (var i = 0; i < this.length; i++) 
        {
            if (!this[i].sqrtGrid) 
            {
            	console.log('creating new instance');
                this[i].sqrtGrid = new SQRTGrid(this[i], options);
                collection.push(this[i].sqrtGrid);
            }
        }
        return collection.length > 1 ? collection : collection[0];
    };
    
    $.fn.sqrtGrid.defaults = 
    {
        xunits: 10,
        yunits: 200,
        cNumShapes: 7
    };
})(jQuery);