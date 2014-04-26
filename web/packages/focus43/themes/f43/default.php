<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>">
<head>
<?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body class="pg-home">

    <div id="parallax" class="height-100">
        <div class="layers height-100">
            <div class="layer bg-butte height-100">
                <div class="inner height-100"></div>
            </div>
            <div class="layer bg-clouds height-100">
                <div class="inner height-100"></div>
            </div>
            <div class="layer bg-moon height-100">
                <div class="inner height-100"></div>
            </div>
        </div>
        <div class="masquerade"></div>
    </div>

    <div id="pages-container" class="height-100">
        <div class="pages height-100">
            <div id="page1" class="page height-100 active">
                <div class="tabular">
                    <div class="cellular">
                        <div class="container-auto">
                            <div class="row">
                                <div class="col-sm-12">
                                    <h1>Focus43</h1>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-8">
                                    <p>Hand crafted web &amp;<br/>mobile applications.</p>
                                </div>
                                <div class="col-sm-4">
                                    <div class="made-here">
                                        <i class="fa fa-barcode"></i>
                                        <span>Made In U.S.A.</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <a class="btn btn-lg btn-success btn-block">About Us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page height-100">
                <div class="tabular">
                    <div class="cellular">
                        <div class="container-auto">
                            <div class="row">
                                <div class="col-sm-12">
                                    <?php $i = 0; while($i <= 1): ?>
                                        <p>this be some text! and some more text so that it gets a little longer and wraps maybe? and some more text so that it gets a little longer and wraps maybe? and some more text so that it gets a little longer and wraps maybe?</p>
                                    <?php $i++; endwhile; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page height-100">
                <div class="tabular">
                    <div class="cellular">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-12">
                                    <h1>Page 3</h1>
                                    <p>wtf there</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page height-100">
                <div class="tabular">
                    <div class="cellular">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-12">
                                    <h1>Page 4</h1>
                                    <p>wtf there</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="navigation">
        <div id="nav-trigger" class="trigger">
            <div class="trigger-inner">
                <a><i class="fa fa-bars"></i></a>
                <span>Navigation</span>
            </div>
        </div>
        <div class="nav-container">
            <div class="tabular">
                <div class="cellular">
                    <ul id="nav-list" class="list-unstyled">
                        <li><a>Home</a></li>
                        <li><a>About</a></li>
                        <li><a>Projects</a></li>
                        <li><a>Drop A Line</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>


<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>