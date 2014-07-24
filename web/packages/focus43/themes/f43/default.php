<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" ng-app="f43">
<head>
<?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body animate>

    <div id="parallax">
        <div class="inner">
            <div id="layer-butte" class="layer"></div>
            <div id="layer-clouds" class="layer"></div>
            <div id="layer-moon" class="layer"></div>
        </div>
    </div>

    <div id="content">
        <div id="track">
            <section id="section-home">
                <div class="tabular">
                    <div class="cellular" style="position:relative;">
                        <h1>
                            <span>w</span>
                            <span>e</span>
                            <span>&nbsp;</span>
                            <span>c</span>
                            <span>r</span>
                            <span>a</span>
                            <span>f</span>
                            <span>t</span>
                            <span>&nbsp;</span>
                            <span>e</span>
                            <span>x</span>
                            <span>p</span>
                            <span>e</span>
                            <span>r</span>
                            <span>i</span>
                            <span>e</span>
                            <span>n</span>
                            <span>c</span>
                            <span>e</span>
                            <span>s</span>
                        </h1>
                    </div>
                </div>
            </section>

            <section id="section-about">
                <div class="subscroller">
                    <div class="inside-track">
                        <div class="pane">
                            <img src="<?php echo FOCUS43_IMAGE_PATH; ?>screenshot.png" alt="" />
                        </div>
                        <div class="pane">
                            <img src="<?php echo FOCUS43_IMAGE_PATH; ?>screenshot.png" alt="" />
                        </div>
                        <div class="pane">
                            <img src="<?php echo FOCUS43_IMAGE_PATH; ?>screenshot.png" alt="" />
                        </div>
                    </div>
                </div>
                <div class="descriptions">
                    <div class="node tabular">
                        <div class="cellular">
                            <h2>Town Of Jackson (Municipality)</h2>
                            <p>Lorem ipsum dolor sit amet consect et tetur</p>
                        </div>
                    </div>
                    <div class="node tabular">
                        <div class="cellular">
                            <h2>Another Project</h2>
                            <p>Frack yea dude</p>
                        </div>
                    </div>
                    <div class="node tabular">
                        <div class="cellular">
                            <h2>A third project yea?</h2>
                            <p>So fly baby so fly</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="section-work">
                <div class="rotated"></div>
            </section>

            <section id="section-experiments">
                <p>Experiments</p>
                <a href="/experiments/this-is-the-experiment-name">Click here</a>
            </section>

            <section id="section-contact">
                <p>Contact Us</p>
            </section>
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