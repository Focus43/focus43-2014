<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" ng-app="f43">
<head>
<?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body animator ng-class="{'sidebar-open':sidebar}">

    <div id="parallax">
        <div class="inner">
            <div id="layer-butte" class="layer"></div>
            <div id="layer-clouds" class="layer"></div>
            <div id="layer-moon" class="layer"></div>
        </div>
    </div>

    <script id="/home" type="text/ng-template">
        <?php Loader::packageElement('templates/home', 'focus43'); ?>
    </script>

    <script id="/about" type="text/ng-template">
        <?php Loader::packageElement('templates/about', 'focus43'); ?>
    </script>

    <script id="/work" type="text/ng-template">
        <?php Loader::packageElement('templates/work', 'focus43'); ?>
    </script>

    <script id="/experiments" type="text/ng-template">
        <?php Loader::packageElement('templates/experiments', 'focus43'); ?>
    </script>

    <script id="/contact" type="text/ng-template">
        <?php Loader::packageElement('templates/contact', 'focus43'); ?>
    </script>

    <div id="content">
        <div id="content-l2">
            <div class="page" ng-view ng-class="pageClass"></div>
        </div>

        <!-- nav (sidebar) -->
        <?php Loader::packageElement('theme/nav', 'focus43'); ?>
    </div>

<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>