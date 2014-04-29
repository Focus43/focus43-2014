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
                        <div class="container-auto max-645">
                            <div class="row">
                                <div class="col-sm-12">
                                    <h1 class="cubify cubify-magenta">Focus43</h1>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-8">
                                    <p class="cubify cubify-blue">Hand crafted web &amp; mobile applications.</p>
                                    <div class="learn-more">
                                        <a class="cubify cubify-orange" onclick="controls.goto(1)">About Us <i class="fa fa-angle-right"></i></a>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="hidden-xs made-here cubify cubify-green">
                                        <i class="fa fa-barcode"></i>
                                        <span>Made In U.S.A.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="page2" class="page height-100">
                <div class="tabular">
                    <div class="cellular">
                        <div class="container-auto max-979">
                            <div class="row">
                                <div class="col-sm-12">
                                    <h2 class="cubify cubify-green">We're Focus43</h2>
                                    <h4 class="cubify cubify-orange">Nice To Meet You</h4>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="cubify cubify-blue">
                                        <?php $a = new Area('About Us'); $a->display($c); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="page4" class="page height-100">
                <div class="tabular">
                    <div class="cellular">
                        <div class="container-auto max-700">
                            <form id="frmContact">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="trans form-group cubify">
                                            <h2>Get In Touch</h2>
                                            <?php $a = new Area('Contact Us'); $a->display($c); ?>
                                        </div>
                                    </div>
                                </div>
                                <div class="row form-sent">
                                    <div class="col-sm-12">
                                        <div class="form-group cubify">
                                            <h4>Sent! We will be in touch shortly.</h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-unsent">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group cubify">
                                                <label class="sr-only">Name</label>
                                                <input type="text" name="name" class="form-control input-lg" placeholder="Name" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group cubify">
                                                <label class="sr-only">Email</label>
                                                <input type="text" name="email" class="form-control input-lg" placeholder="Email" />
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group cubify">
                                                <label class="sr-only">Phone</label>
                                                <input type="text" name="phone" class="form-control input-lg" placeholder="Phone" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group cubify">
                                                <label class="sr-only">Message</label>
                                                <textarea name="message" class="form-control input-lg" rows="6" placeholder="Whats Up?"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="form-group cubify">
                                                <button type="submit" class="btn btn-lg btn-block"><i class="fa fa-refresh fa-spin"></i> Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <nav id="navigation">
        <div id="nav-trigger" class="trigger">
            <div class="trigger-inner">
                <a class="cubify cubify-magenta"><i class="fa fa-bars"></i></a>
                <span>Navigation</span>
            </div>
        </div>
        <div class="nav-container">
            <div class="tabular">
                <div class="cellular">
                    <ul id="nav-list" class="list-unstyled">
                        <li><a>Home</a></li>
                        <li><a>About</a></li>
                        <li><a>Drop A Line</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>


<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>