<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" ng-app="f43">
<head>
<?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body scroll-handler=".layer" data-scroll-target="#content">

    <div id="parallax">
        <div class="inner">
            <div id="layer-butte" class="layer"></div>
            <div id="layer-clouds" class="layer"></div>
            <div id="layer-moon" class="layer"></div>
        </div>
    </div>

    <div id="content">
        <section id="section-home">
            <div class="tabular">
                <div class="cellular">
                    <div id="stacked" animations>
                        <h1>Focus43</h1>
                        <span>One</span><span>Two</span>
                    </div>
                </div>
            </div>
        </section>

        <section id="section-about">
            <p>About</p>
        </section>

        <section id="section-work">
            <p>Our work</p>
        </section>

        <section id="section-experiments">
            <p>Experiments</p>
            <a href="/experiments/this-is-the-experiment-name">Click here</a>
        </section>

        <section id="section-contact">
            <p>Contact Us</p>
        </section>
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