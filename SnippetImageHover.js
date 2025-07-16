/// Klasse erstellen
/// IDs:
/// Canvas Objekt = js-snippet-image-hover
/// Standard Bild = js-snippet-image-hover-standard
/// Klassen:
/// Main container = js-image-hover
function SnippetImageHover() {
    this.m_Image = null;
    this.m_Canvas = null;
    this.m_ctxCanvas = null;
    this.m_arrImages = new Array(); // Array mit Image Objekten
    this.m_ImageMain = null; // Das Bild Objekt das immer wenn nicht gehovert wurde, dargestellt wird.
    this.m_ActiveCollider = null;
    this.m_ColliderHit = false; // Maus über collider
    this.m_FrameRedrawn = false;
    this.m_ImageCounter = $(".js-image-hover .collider").length - 1;
    this.m_ImagesLoaded = 0;
    this.m_Opacity = 0;
    this.m_StopPointer = false;
    this.m_PointerInit = false;
    this.m_Fadeout = false;
    // Bilder laden
    this.loadImages();
}

SnippetImageHover.prototype.Init = function()
{
    // Canvas erstellen
    this.loadCanvas();
    // Image draw
    this.drawImage(this.m_ImageMain.m_Image, 1);
    // Zeichnen der Divs mit den Events
    this.drawCollider();
    // Pointer zeichnen
    this.drawPointer();
    // Eventlistener hinzufügen
    this.AddEventListener();
}

//// Collider Initialisieren


/// Pointer zeichnen
SnippetImageHover.prototype.drawPointer = function()
{
    this.m_StopPointer = false;
    var c = this; // Override, wird benötigt damit die Klasse bzw. das Objekt der klasse in der folgenden Funktion erkannt wird

    if (this.m_PointerInit == false) {
        for (var i = 0; i < this.m_arrImages.length; i++)
        {
            this.animatePointer(this.m_arrImages[i].GetPointer());
        }
        this.m_PointerInit = true;
    }
}

/// Animate Pointer
SnippetImageHover.prototype.animatePointer = function(p_Pointer)
{
    var c = this; // Override, wird benötigt damit die Klasse bzw. das Objekt der klasse in der folgenden Funktion erkannt wird

    if (this.m_StopPointer == false) {
        this.m_ctxCanvas.save();
        if (this.m_arrImages[0].GetPointer() == p_Pointer)
        {
            /// Nur beim ersten element ausführen
            this.m_ctxCanvas.clearRect(0, 0, this.m_Canvas.width, this.m_Canvas.height);
            if (this.m_ActiveCollider != null)
            {
                this.drawImage(this.m_ActiveCollider.m_Image, 1);
            } else {
                this.drawImage(this.m_ImageMain.m_Image, 1);
            }
            this.drawCollider();
        }

        if (this.m_ActiveCollider != null)
        {
            if (this.m_ActiveCollider.GetPointer() == p_Pointer) {
                this.drawTooltip(this.m_ActiveCollider, p_Pointer);
            }
        }
        this.m_ctxCanvas.globalAlpha = (p_Pointer.Opacity() / 100);
        this.m_ctxCanvas.drawImage(p_Pointer.m_Image, 0, 0, p_Pointer.m_Image.width, p_Pointer.m_Image.height, p_Pointer.x(), p_Pointer.y(), p_Pointer.m_Image.width, p_Pointer.m_Image.height);
        this.m_ctxCanvas.restore();

        p_Pointer.updateOpacity();
    } else {
        p_Pointer.SetOpacity(0);
    }

    requestAnimationFrame(function () { c.animatePointer(p_Pointer); });
}

/// Eventlistener hinzufügen
SnippetImageHover.prototype.AddEventListener = function ()
{
    var c = this; // Override, wird benötigt damit die Klasse bzw. das Objekt der klasse in der folgenden Funktion erkannt wird

    $(document).on("mousemove", ".js-image-hover canvas", function (e) {
        c.onMouseMove(e);
    });

    $(document).on("mouseleave", ".js-image-hover canvas", function (e) {
        c.onMouseLeave(e);
    });

    $(document).on("click", ".js-image-hover canvas", function (e) {
        c.onClick(e);
    });
}

/// Beim Klicken auf einen Collider
SnippetImageHover.prototype.onClick = function(e)
{
    /// Position berechnen 
    var position = $(".js-image-hover").offset();
    var intTop = position.top;
    var intLeft = position.left;

    // Wird ausgeführt, wenn sich die Maus im Canvas befindet, 
    // Jetzt muss überprüft werden, ob die Maus sich über einem Collider befindet
    var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
    var mouseX = e.pageX ? e.pageX : e.clientX + body.scrollLeft - body.clientLeft;
    var mouseY = e.pageY ? e.pageY : e.clientY + body.scrollTop - body.clientTop;

    mouseX -= intLeft;
    mouseY -= intTop;
    
    /// Durchlaufen aller Collider um herauszufinden, ob ein Collider getroffen wurde
    for (var i = 0; i < this.m_arrImages.length; i++) {
        Collider = this.m_arrImages[i];
        if (Collider.Contains(mouseX, mouseY)) {
            var link = Collider.Link();
            if(link.length > 0)
            {
                window.open(link, "_blank");
            }
        }
    }
}

/// Wird aufgerufen wenn die maus das canvas verlässt
SnippetImageHover.prototype.onMouseLeave = function(e)
{
    this.m_Opacity = 0;
    this.SetCollider(this.m_ImageMain);
    this.m_ColliderHit = false;
    this.updateImage(this.m_ImageMain);
    this.removeTooltip();
}

/// Wird aufgerufen wenn die maus im canvas bewegt wird
SnippetImageHover.prototype.onMouseMove = function(e)
{
    var c = this; // Override, wird benötigt damit die Klasse bzw. das Objekt der klasse in der folgenden Funktion erkannt wird

    /// Position berechnen 
    var position = $(".js-image-hover").offset();
    var intTop = position.top;
    var intLeft = position.left;

    // Wird ausgeführt, wenn sich die Maus im Canvas befindet, 
    // Jetzt muss überprüft werden, ob die Maus sich über einem Collider befindet
    var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
    var mouseX = e.pageX ? e.pageX : e.clientX + body.scrollLeft - body.clientLeft;
    var mouseY = e.pageY ? e.pageY : e.clientY + body.scrollTop - body.clientTop;

    mouseX -= intLeft;
    mouseY -= intTop;

    this.m_ColliderHit = false;

    /// Durchlaufen aller Collider um herauszufinden, ob ein Collider getroffen wurde
    for (var i = 0; i < c.m_arrImages.length; i++) {
        Collider = c.m_arrImages[i];
        if (Collider.Contains(mouseX, mouseY)) {
            if (c.m_ActiveCollider != Collider) {
                c.m_Opacity = 0;
                c.SetCollider(Collider);
                c.m_StopPointer = true;
                // Wenn getroffen dann Bild austauschen
                c.updateImage(Collider);
            }
            this.m_ColliderHit = true;
        }
    }

    /// Wenn kein Collider getroffen wurde, dann setze das Bild zurück.
    if (this.m_ColliderHit == false) {
        this.m_Opacity = 0;
        this.SetCollider(this.m_ImageMain);
        this.updateImage(this.m_ImageMain);
    }
}

// Collider wechseln der Aktiv ist
SnippetImageHover.prototype.SetCollider = function(p_Collider)
{
    this.m_ActiveCollider = p_Collider;
    this.removeTooltip();
}

/// Bild austauschen
SnippetImageHover.prototype.updateImage = function(p_Collider)
{
    var c = this; // Override, wird benötigt damit die Klasse bzw. das Objekt der klasse in der folgenden Funktion erkannt wird
    if (this.m_Opacity > 100 || c.m_ActiveCollider == null || p_Collider.m_Image != c.m_ActiveCollider.m_Image)
    {
        return;
    }
    requestAnimationFrame(function () { c.updateImage(p_Collider) });
    this.drawImage(p_Collider.m_Image, this.m_Opacity / 100);

    if (this.m_Opacity == 0)
    {
        this.m_Fadeout = true;
    }
    if (this.m_Fadeout == true)
    {
        this.drawTooltip(p_Collider, p_Collider.GetPointer())
    }

    if (this.m_Opacity >= 100)
    {
        this.drawPointer();
        this.m_Fadeout = false;
    }
    this.m_Opacity+=2;
}

/// Tooltip entfernen
SnippetImageHover.prototype.removeTooltip = function()
{
    $(document).find(".tooltip").remove();
}

/// Tooltip darstellen
SnippetImageHover.prototype.drawTooltip = function(p_Collider, p_Pointer)
{
    if (p_Pointer == null)
    {
        return;
    }
    var intX = 0;
    var intY = 0;
    var targetX = 0;
    var targetY = 0;

    // Ausgangsposition
    //intX = parseInt(p_Collider.x()) + parseInt(p_Collider.width() / 2);
    //intY = parseInt(p_Collider.y()) + parseInt(p_Collider.height() / 2);
    intX = parseInt(p_Pointer.x()) + 12;
    intY = parseInt(p_Pointer.y()) + 12;

    // Tooltip Position
    if(intX > this.m_Canvas.width / 2){
        targetX = intX-300;
    }else{
        targetX = intX+150;
    }

    if(intY > this.m_Canvas.height / 2)
    {
        targetY = intY-50;
    }else{
        targetY = intY+50;
    }

    this.m_ctxCanvas.strokeStyle = "#2bbfb1";
    this.m_ctxCanvas.beginPath();
    this.m_ctxCanvas.moveTo(intX, intY);
    this.m_ctxCanvas.lineTo(intX, targetY);
    this.m_ctxCanvas.moveTo(intX, targetY);
    this.m_ctxCanvas.lineTo(targetX, targetY);
    this.m_ctxCanvas.stroke();

    /// Position berechnen 
    var position = $(".js-image-hover").offset();
    var xTooltip = targetX + position.left;
    var yTooltip = targetY + position.top - 19;

    $(document).find(".js-image-hover").each(function () { 
        if (p_Collider.Text().length > 0) {
            if($(".tooltip").length == 0)
            {
                $(this).prepend("<div class='tooltip'>" + p_Collider.Text() + "</div>");
            } else {
                $(this).find(".tooltip").html(p_Collider.Text());
            }
            $(this).find(".tooltip").css("left", xTooltip + "px");
            $(this).find(".tooltip").css("top", yTooltip + "px");
            $(this).find(".tooltip").css("z-index", "10000");
            $(this).find(".tooltip").fadeIn(100);
        }
    });
}

/// Rechtecke zeichnen
SnippetImageHover.prototype.drawCollider = function ()
{
    for(var i = 0; i < this.m_arrImages.length; i++)
    {
        Obj = this.m_arrImages[i]; // Obj = SnippetImageHoverImage
        if ($(".js-image-hover").hasClass("debug")) {
            this.m_ctxCanvas.strokeRect(Obj.x(), Obj.y(), Obj.width(), Obj.height());
        } else {
            this.m_ctxCanvas.rect(Obj.x(), Obj.y(), Obj.width(), Obj.height());
        }
    }
}

/// Funktion zum zeichnen des Bildes
SnippetImageHover.prototype.drawImage = function(p_Image, p_Opacity)
{
    if(this.m_ctxCanvas == null)
    {
        console.log("Canvas not found!");
    } else {
        this.m_ctxCanvas.save();
        this.m_ctxCanvas.globalAlpha = p_Opacity;
        if (p_Opacity == 0)
        {
            //thi.m_ctxCanvas.clearRect(0, 0, this.m_Canvas.width, this.m_Canvas.height);
        }
        this.m_ctxCanvas.drawImage(p_Image, 0, 0);
        this.m_ctxCanvas.restore();
    }
}

/// Funktion zum erstellen des Canvas
SnippetImageHover.prototype.loadCanvas = function()
{
    this.m_Canvas = document.createElement("canvas");
    this.m_ctxCanvas = this.m_Canvas.getContext("2d");

    if (this.m_ImageMain == null)
    {
        console.log("ImageMain not found!");
    } else {
        this.m_Canvas.width = this.m_ImageMain.m_Image.width;
        this.m_Canvas.height = this.m_ImageMain.m_Image.height;
        this.m_Canvas.style.position = "absolute";

        $(".js-image-hover").prepend(this.m_Canvas);
    }
}

/// Funktion zum laden der Bilder
SnippetImageHover.prototype.loadImages = function()
{
    var c = this; // Override, wird benötigt damit die Klasse bzw. das Objekt der klasse in der folgenden Funktion erkannt wird
    // Bilder auslesen und in das Array speichern
    $(".js-image-hover").find(".collider").each(function () {
        var objImage = new Image();
        objImage.src = $(this).attr("image");

        objImage.onload = function () {
            c.m_ImagesLoaded++;
            if(c.m_ImagesLoaded == c.m_ImageCounter)
            {
                c.Init();
            }
        };
        
        // Wenn es das Standard Bild ist dann nicht ins Array sondern als Main Bild setzen
        if ($(this).prop("id") == "standard") {
            c.m_ImageMain = new SnippetImageCollider(objImage, "", 0, 0, 0, 0, $(this).attr("link"));
        } else {
            Img = new SnippetImageCollider(objImage, $(this).attr("text"), $(this).attr("rectX"), $(this).attr("rectY"), $(this).attr("rectWidth"), $(this).attr("rectHeight"), $(this).attr("link"));
            /// Pointer hinzufügen
            var pointer = $(this).find(".pointer");
            var PointerImage = new Image(24, 24);
            PointerImage.src = "Image/Pointer.png";
            PointerObj = new SnippetPointer(PointerImage, pointer.attr("rectx"), pointer.attr("recty"));
            Img.SetPointer(PointerObj);
            /// ins array übernehmen
            c.m_arrImages.push(Img);
        }
        $(this).css("display", "none");
    });
}

$(document).ready(function () { 
    var SnippetHover = new SnippetImageHover();
});


/// Klasse für die Bilder die Ausgewählt werden können
/// objImage = Bild Objekt
/// intX, intY, intWidth, intHeight = Parameter für die HoverBox die den Tausch des Bildes auslöst
function SnippetImageCollider(p_objImage, p_Text, p_intX, p_intY, p_intWidth, p_intHeight, p_link)
{
    this.m_Image = p_objImage;
    this.m_intX = p_intX;
    this.m_intY = p_intY;
    this.m_intWidth = p_intWidth;
    this.m_intHeight = p_intHeight;
    this.m_text = p_Text;
    this.m_link = p_link;
    this.m_Pointer = null;
}

/// Pointer hinzufügen
SnippetImageCollider.prototype.SetPointer = function(p_Pointer)
{
    this.m_Pointer = p_Pointer;
}

/// Pointer abfragen
SnippetImageCollider.prototype.GetPointer = function()
{
    return this.m_Pointer;
}

SnippetImageCollider.prototype.Link = function()
{
    return this.m_link;
}

SnippetImageCollider.prototype.Text = function()
{
    return this.m_text;
}

SnippetImageCollider.prototype.x = function ()
{
    return this.m_intX;
}

SnippetImageCollider.prototype.y = function () {
    return this.m_intY;
}

SnippetImageCollider.prototype.width = function () {
    return this.m_intWidth;
}

SnippetImageCollider.prototype.height = function () {
    return this.m_intHeight;
}

/// Liefert true zurück wenn die Koordinaten im Collider Liegen
SnippetImageCollider.prototype.Contains = function (p_int_mouse_x, p_int_mouse_y)
{
    var x = this.m_intX;
    var y = this.m_intY;
    var width = this.m_intX + this.m_intWidth;
    var height = this.m_intY + this.m_intHeight;
    
    if (x < p_int_mouse_x && width > p_int_mouse_x && y < p_int_mouse_y && height > p_int_mouse_y)
    {
        return true;
    }
    return false;
}

/// Pointer Objekt
function SnippetPointer(p_objImage, p_intX, p_intY)
{
    this.m_Direction = 1;
    this.m_Opacity = 0;
    this.m_Image = p_objImage;
    this.m_intX = p_intX;
    this.m_intY = p_intY;
}

SnippetPointer.prototype.x = function()
{
    return this.m_intX;
}

SnippetPointer.prototype.y = function () {
    return this.m_intY;
}

SnippetPointer.prototype.Opacity = function () {
    return this.m_Opacity;
}

SnippetPointer.prototype.SetOpacity = function(p_Opacity)
{
    this.m_Opacity = p_Opacity;
}

SnippetPointer.prototype.updateOpacity = function()
{
    if (this.m_Opacity <= 0) {
        this.m_Direction = 1;
    } else if (this.m_Opacity >= 100) {
        this.m_Direction = -1;
    }

    if(this.m_Direction == 1)
    {
        this.IncreaseOpacity();
    } else
    {
        this.DecreaseOpacity();
    }
}

SnippetPointer.prototype.IncreaseOpacity = function()
{
    this.m_Opacity+=2;
}

SnippetPointer.prototype.DecreaseOpacity = function()
{
    this.m_Opacity-=2;
}