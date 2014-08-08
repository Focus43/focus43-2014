<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" ng-app="f43">
<head>
<?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body animator ng-class="{'sidebar-open':sidebar.open}">

    <script type="text/ng-template" id="/experiments">
        <h1>This is an expiremnt template!</h1>
    </script>

    <div id="parallax">
        <div class="inner">
            <div id="layer-butte" class="layer"></div>
            <div id="layer-clouds" class="layer"></div>
            <div id="layer-moon" class="layer"></div>
        </div>
    </div>

    <div id="content">
        <div id="track">
            <section class="section-home">
                <div class="tabular">
                    <div class="cellular" style="position:relative;">
                        <img src="<?php echo FOCUS43_IMAGE_PATH; ?>3d-logo-lighter.png" />
                        <!--<h1>We build web & iOS applications</h1>-->
                    </div>
                </div>
            </section>

            <section class="section-about">
                <div class="tabular">
                    <div class="cellular">
                        <?php Loader::packageElement('section_partials/about', 'focus43', array('c' => $c)); ?>
                    </div>
                </div>
            </section>

            <section class="section-work">
                <div class="tabular">
                    <div class="cellular">
                        this be the work section
                    </div>
                </div>
            </section>

            <section class="section-experiments">
                <div class="tabular">
                    <div class="cellular">
                        <p>Experiments</p>
                        <p><a href="/experiments/this-is-the-experiment-name">Click here</a></p>
                    </div>
                </div>
            </section>

            <section class="section-contact">
                <!--<div class="map-back">
                    <div class="gmap" googlemap="mapOptions"></div>
                </div>-->

                <div class="tabular">
                    <div class="cellular">
                        <?php Loader::packageElement('section_partials/contact', 'focus43', array('c' => $c)); ?>
                    </div>
                </div>
            </section>
        </div>

        <!-- nav (sidebar) -->
        <nav>
            <div class="inner">
                <a class="trigger">
                    <i class="fa fa-bars"></i>
                </a>
                <ul class="list-unstyled section-nav">
                    <li class="active"><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/work">Work</a></li>
                    <li><a href="/experiments">Experiments</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
        </nav>

        <!-- arrows -->
        <div class="arrow left">
            <div class="inner">
                <a><img src="<?php echo FOCUS43_IMAGE_PATH; ?>arrow.svg" alt="" /></a>
            </div>
        </div>
        <div class="arrow right">
            <div class="inner">
                <a><img src="<?php echo FOCUS43_IMAGE_PATH; ?>arrow.svg" alt="" /></a>
            </div>
        </div>
    </div>

    <div id="ngviewer" class="custom-view" ng-view></div>

<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>