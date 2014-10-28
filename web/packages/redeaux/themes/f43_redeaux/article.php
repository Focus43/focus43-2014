<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" class="<?php echo $cmsClasses; ?>">
<?php Loader::packageElement('theme/head_tag', RedeauxPackage::PACKAGE_HANDLE); ?>

<body ng-controller="CtrlRoot" ng-class="bodyClasses">

    <div id="level-1">
        <?php Loader::packageElement('theme/nav', RedeauxPackage::PACKAGE_HANDLE); ?>
        <div id="level-2">
            <main class="page-body" ng-view ng-animate-children ng-class="transitionClass">
                <?php Loader::packageElement("layouts/{$pageElement}", RedeauxPackage::PACKAGE_HANDLE, array(
                    'c' => $c
                )); ?>
            </main>
        </div>
        <?php Loader::packageElement('theme/loader', RedeauxPackage::PACKAGE_HANDLE); ?>
    </div>

<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>