<div class="page-content" tpl-about ng-class="animClass">

    <article class="tabular heading">
        <h1 class="cellular">About</h1>
    </article>

    <article class="tabular verbage">
        <div class="cellular">
            <!--<p>We're a small team of web &amp; iOS developers based in lovely Jackson, WY.</p>-->
            <?php $a = new Area('About 1'); $a->display($c); ?>
        </div>
    </article>

    <article class="peeps">
        <h3>Team <small>(In Bad Photoshops)</small></h3>
        <div class="homey arik">
            <div class="tabular">
                <div class="cellular">
                    Arik
                </div>
            </div>
        </div>
        <div class="homey stine">
            <div class="tabular">
                <div class="cellular">
                    Stine
                </div>
            </div>
        </div>
        <div class="homey jon">
            <div class="tabular">
                <div class="cellular">
                    Jon
                </div>
            </div>
        </div>
    </article>

    <article class="tabular verbage">
        <div class="cellular">
            <!--<p>Our sweet spot is teaming up with other agencies/design teams needing developers. We like to focus on our strong suit - authoring top notch code.</p>-->
            <?php $a = new Area('About 2'); $a->display($c); ?>
        </div>
    </article>

    <div class="instagrams" ng-include="_instagram"></div>

</div>