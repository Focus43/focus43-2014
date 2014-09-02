<?php
    $area1 = new Area('Main');
    $area2 = new Area('Sidebar');
?>
<section ng-class="pageClass">
    <div class="tabular">
        <div class="cellular">
            <div class="container">
                <div class="row">
                    <div class="col-sm-8" area-partial="<?php echo $area1->arHandle; ?>">
                        <div<?php if( !$cmsEditing ){echo ' ng-include="_partial.path"';} ?>>
                            <?php $area1->display($c); ?>
                        </div>
                    </div>
                    <div class="col-sm-4" area-partial="<?php echo $area2->arHandle; ?>">
                        <div<?php if( !$cmsEditing ){echo ' ng-include="_partial.path"';} ?>>
                            <?php $area2->display($c); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>