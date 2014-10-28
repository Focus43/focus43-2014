<div class="page-content" portfolio-toj>
    <div class="timeline-progress">
        <span class="value"></span>
        <a class="marker" data-label="intro">1</a>
        <a class="marker" data-label="textual">2</a>
        <a class="marker" data-label="screens">3</a>
        <a class="marker" data-label="about">4</a>
        <a class="marker" data-label="video">5</a>
    </div>

    <aside>
        <div class="close">
            <a href="/work">Close</a>
            <span>Close Project</span>
        </div>
    </aside>

    <div class="tabular intro" preload="<?php echo REDEAUX_IMAGE_PATH; ?>portfolio/toj/snake_river.jpg" data-blocking>
        <div class="cellular">
            <h1>Town Of Jackson</h1>
            <small class="instruct">Scroll <i class="fa fa-angle-down"></i></small>
            <p ng-click="autoplay()">Or autoplay...</p>
        </div>
        <div class="textual" preload="<?php echo REDEAUX_IMAGE_PATH; ?>portfolio/toj/antlers.jpg" data-blocking>
            <div class="tabular">
                <div class="cellular">
                    <h2>Design. Development. SEO Roadmap. Management Planning.</h2>
                    <h3>Focus43 was hired to lead all project phases: discovery, planning, design and implementation.</h3>
                </div>
            </div>
        </div>
    </div>

    <div class="tabular screens">
        <div class="cellular">
            <div class="bg" preload="<?php echo REDEAUX_IMAGE_PATH; ?>portfolio/toj/blue_abstract.jpg" data-blocking></div>
            <div class="phonerize">
                <img preload="<?php echo REDEAUX_IMAGE_PATH; ?>portfolio/toj/phone_r1.png" data-blocking />
                <img preload="<?php echo REDEAUX_IMAGE_PATH; ?>portfolio/toj/phone_r2.png" data-blocking />
                <img preload="<?php echo REDEAUX_IMAGE_PATH; ?>portfolio/toj/phone_r3.png" data-blocking />
                <span class="shadower"></span>
                <span class="shadower"></span>
                <span class="shadower"></span>
            </div>
        </div>
    </div>

    <div class="tabular about">
        <div class="cellular">
            <div class="container">
                <div class="row">
                    <div class="col-sm-5">
                        <?php $a = new Area('Col:Left'); $a->display($c); ?>
                    </div>
                    <div class="col-sm-7">
                        <?php $a = new Area('Col:Right'); $a->display($c); ?>
                        <!--<img preload="/packages/redeaux/_scratch/toj/phone_round2.png" data-blocking style="max-height:750px;" />-->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="tabular video">
        <!--<video autoplay loop preload>
            <source src="/packages/redeaux/_scratch/timelapse_blur.mp4" type="video/mp4" />
        </video>-->
        <div style="position:absolute;top:0;left:0;width:100%;height:100%;">
            <?php $a = new Area('Section'); $a->display($c); ?>
        </div>
        <div class="cellular" style="position:relative;z-index:1;">
            <h1>Get In Touch</h1>
        </div>
    </div>
</div>