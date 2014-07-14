var TO_RADIANS=Math.PI/180;function ImageParticle(img,posx,posy)
{this.posX=posx;this.posY=posy;this.velX=0;this.velY=0;this.shrink=1;this.size=1;this.maxSize=-1;this.drag=1;this.gravity=0;this.alpha=1;this.fade=0;this.spin=0;this.rotation=0;this.compositeOperation='source-over';this.img=img;this.update=function()
{this.velX*=this.drag;this.velY*=this.drag;this.velY+=this.gravity;this.posX+=this.velX;this.posY+=this.velY;this.size*=this.shrink;if((this.maxSize>0)&&(this.size>this.maxSize))
this.size=this.maxSize;this.alpha-=this.fade;if(this.alpha<0)this.alpha=0;this.rotation+=this.spin;}
this.render=function(c)
{if(this.alpha==0)return;c.save();c.translate(this.posX,this.posY);c.scale(this.size,this.size);c.rotate(this.rotation*TO_RADIANS);c.translate(img.width*-0.5,img.width*-0.5);c.globalAlpha=this.alpha;c.globalCompositeOperation=this.compositeOperation;c.drawImage(img,0,0);c.restore();}}
function randomRange(min,max)
{return((Math.random()*(max-min))+ min);}
