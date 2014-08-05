<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" ng-app="f43">
<head>
<?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body alive>

    <div id="parallax">
        <div class="inner">
            <div id="layer-butte" class="layer"></div>
            <div id="layer-clouds" class="layer"></div>
            <div id="layer-moon" class="layer"></div>
        </div>
    </div>

    <div id="content">
        <div id="track">
            <section id="section-home" class="active">
                <div class="tabular">
                    <div class="cellular" style="position:relative;">
                        <img src="<?php echo FOCUS43_IMAGE_PATH; ?>3d-logo-lighter.png" />
                    </div>
                </div>
            </section>

            <section id="section-about">
                <div class="tabular">
                    <div class="cellular">
                        <h2>Focus43 Oh Yea</h2>
                        <img src="<?php echo FOCUS43_IMAGE_PATH; ?>screenshot.png" />
                        <h2>Focus43 Oh Yea</h2>
                        <img src="<?php echo FOCUS43_IMAGE_PATH; ?>screenshot.png" />
                        <h2>Focus43 Oh Yea</h2>
                        <img src="<?php echo FOCUS43_IMAGE_PATH; ?>screenshot.png" />
                    </div>
                </div>
            </section>

            <section id="section-work">
                <div class="tabular">
                    <div class="cellular">
                        this be the work section
                    </div>
                </div>
            </section>

            <section id="section-experiments">
                <div class="tabular">
                    <div class="cellular">
                        <p>Experiments</p>
                        <p><a href="/experiments/this-is-the-experiment-name">Click here</a></p>
                    </div>
                </div>
            </section>

            <section id="section-contact">
                <div class="tabular">
                    <div class="cellular">
                        <p>Contact Us</p>
                    </div>
                </div>
            </section>
        </div>

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

    <div ng-view></div>

    <nav>
        <ul class="list-inline">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/work">Work</a></li>
            <li><a href="/experiments">Experiments</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>

<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>