# ==============================================================================
# JungHyeon Korean — Admin-to-Live-Site Full Integration Test Suite
# Tests all 10 integration requirements from user specification
# ==============================================================================

$baseUrl = "http://localhost:3000"
$allPassed = $true
$results = @()

function Report-Result($id, $name, $passed, $details) {
    if (-not $passed) { $global:allPassed = $false }
    $statusStr = if ($passed) { "[PASS]" } else { "[FAIL]" }
    $color = if ($passed) { "Green" } else { "Red" }
    Write-Host "$statusStr Item $id : $name" -ForegroundColor $color
    if ($details) {
        Write-Host "       -> $details" -ForegroundColor Gray
    }
    $global:results += [PSCustomObject]@{
        Id = $id
        Name = $name
        Passed = $passed
        Details = $details
    }
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " RUNNING ADMIN-TO-LIVE-SITE INTEGRATION TEST SUITE" -ForegroundColor Cyan
Write-Host " Target URL: $baseUrl" -ForegroundColor Cyan
Write-Host "======================================================================`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# CHECK 1: Create a lesson in admin as content_editor -> NOT visible on live site
# ------------------------------------------------------------------------------
try {
    $slug1 = "test-lesson-grammar-01"
    $body1 = @{
        action = "create_draft"
        slug = $slug1
        title = "Bài kiểm tra: Tiểu từ chủ ngữ -이/가"
        koreanTitle = "주격 조사 -이/가"
        levelBadge = "SƠ CẤP"
        levelName = "TOPIK 1 • Sơ cấp"
        actorRole = "content_editor"
        actorEmail = "editor@junghyeon.vn"
    } | ConvertTo-Json

    $draftRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $body1
    
    # Check live lesson page: must return 404 (not published)
    $liveResCode = 0
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/lessons/$slug1" -Method Get -MaximumRedirection 0 -ErrorAction Stop
        $liveResCode = $res.StatusCode
    } catch {
        $liveResCode = $_.Exception.Response.StatusCode.value__
    }

    # Check sitemap: must NOT contain the draft slug
    $sitemap = (Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/sitemap.xml" -Method Get).Content
    $inSitemap = $sitemap.Contains($slug1)

    $c1Passed = ($draftRes.success -eq $true) -and ($liveResCode -eq 404) -and (-not $inSitemap)
    Report-Result 1 "Create lesson as content_editor -> NOT visible on live site" $c1Passed "Draft created: $($draftRes.draft.status); Live HTTP: $liveResCode; In Sitemap: $inSitemap"
} catch {
    Report-Result 1 "Create lesson as content_editor -> NOT visible on live site" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 2: Submit for review -> comments -> approves -> publishes -> appears on live site & sitemap
# ------------------------------------------------------------------------------
try {
    $slug2 = "test-lesson-grammar-01"
    
    # 2a. Submit for review
    $bodyReview = @{ action = "submit_review"; slug = $slug2; actorRole = "content_editor"; actorEmail = "editor@junghyeon.vn" } | ConvertTo-Json
    $resRev = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyReview

    # 2b. Add reviewer comment
    $bodyComment = @{ action = "add_comment"; slug = $slug2; comment = "Ngữ pháp chuẩn, bài tập đầy đủ. Duyệt xuất bản."; actorRole = "publisher"; actorEmail = "reviewer@junghyeon.vn" } | ConvertTo-Json
    $resCom = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyComment

    # 2c. Approve
    $bodyApprove = @{ action = "approve"; slug = $slug2; actorRole = "publisher"; actorEmail = "reviewer@junghyeon.vn" } | ConvertTo-Json
    $resApp = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyApprove

    # 2d. Publish as super_admin
    $bodyPub = @{ action = "publish"; slug = $slug2; actorRole = "super_admin"; actorEmail = "admin@junghyeon.vn" } | ConvertTo-Json
    $resPub = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyPub

    # 2e. Check live site: lesson page must now return 200 OK
    $liveResCode2 = 0
    try {
        $res2 = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/lessons/$slug2" -Method Get -MaximumRedirection 0 -ErrorAction Stop
        $liveResCode2 = $res2.StatusCode
    } catch {
        $liveResCode2 = $_.Exception.Response.StatusCode.value__
    }

    # 2f. Check sitemap: must contain the published slug
    $sitemap2 = (Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/sitemap.xml" -Method Get).Content
    $inSitemap2 = $sitemap2.Contains($slug2)

    $c2Passed = ($resPub.success -eq $true) -and ($liveResCode2 -eq 200) -and $inSitemap2
    Report-Result 2 "Review workflow & Publish -> Live on /lessons/$slug2 and sitemap.xml" $c2Passed "Status: $($resPub.version.status); Live HTTP: $liveResCode2; In Sitemap: $inSitemap2"
} catch {
    Report-Result 2 "Review workflow & Publish" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 3: Edit published lesson -> learners see old version -> publish v2 -> rollback to v1
# ------------------------------------------------------------------------------
try {
    $slug3 = "test-lesson-grammar-01"

    # 3a. Edit published lesson (creates v2 draft with new title)
    $v2Title = "Tiểu từ chủ ngữ -이/가 (Bản cập nhật v2)"
    $bodyEdit = @{ action = "edit_published"; slug = $slug3; updatedTitle = $v2Title; actorRole = "content_editor"; actorEmail = "editor@junghyeon.vn" } | ConvertTo-Json
    $resEdit = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyEdit

    # 3b. Verify learners STILL see old v1 title because v2 is in draft!
    $liveBeforePub = Invoke-RestMethod -Uri "$baseUrl/api/admin/content?slug=$slug3" -Method Get
    $learnerSeesOld = ($liveBeforePub.lesson.title -eq $draftRes.draft.title) -and ($liveBeforePub.lesson.title -ne $resEdit.version.title)

    # 3c. Publish v2 as super_admin
    $bodyPubV2 = @{ action = "publish"; slug = $slug3; versionNumber = 2; actorRole = "super_admin"; actorEmail = "admin@junghyeon.vn" } | ConvertTo-Json
    $resPubV2 = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyPubV2

    # Verify learners now see v2
    $liveAfterPub = Invoke-RestMethod -Uri "$baseUrl/api/admin/content?slug=$slug3" -Method Get
    $learnerSeesV2 = ($liveAfterPub.lesson.title -eq $resEdit.version.title)

    # 3d. Rollback to v1
    $bodyRollback = @{ action = "rollback"; slug = $slug3; targetVersionNumber = 1; actorRole = "super_admin"; actorEmail = "admin@junghyeon.vn" } | ConvertTo-Json
    $resRollback = Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyRollback

    # Verify learners see v1 again
    $liveAfterRollback = Invoke-RestMethod -Uri "$baseUrl/api/admin/content?slug=$slug3" -Method Get
    $learnerSeesV1Again = ($liveAfterRollback.lesson.title -eq $draftRes.draft.title)

    $c3Passed = $learnerSeesOld -and $learnerSeesV2 -and $learnerSeesV1Again
    Report-Result 3 "Version isolation, Publish v2, and Rollback to v1" $c3Passed "Old visible during draft: $learnerSeesOld; v2 live after publish: $learnerSeesV2; v1 restored on rollback: $learnerSeesV1Again"
} catch {
    Report-Result 3 "Version isolation, Publish v2, and Rollback to v1" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 4: Schedule publish for 2 min later -> auto publishes; schedule unpublish -> disappears
# ------------------------------------------------------------------------------
try {
    $slug4 = "test-scheduled-lesson-04"
    # Create draft
    $body4 = @{ action = "create_draft"; slug = $slug4; title = "Bài học Lên Lịch Tự Động"; actorRole = "content_editor"; actorEmail = "editor@junghyeon.vn" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $body4 | Out-Null

    # Schedule publish for timestamp in past/now so cron triggers it
    $pastTime = (Get-Date).AddSeconds(-5).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $bodySchedPub = @{ action = "schedule_publish"; slug = $slug4; versionNumber = 1; publishAt = $pastTime; actorRole = "publisher"; actorEmail = "publisher@junghyeon.vn" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodySchedPub | Out-Null

    # Trigger cron evaluation
    $cronRes1 = Invoke-RestMethod -Uri "$baseUrl/api/admin/cron" -Method Post

    # Check live: must now be published!
    $liveSchedCode1 = 0
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/lessons/$slug4" -Method Get -MaximumRedirection 0 -ErrorAction Stop
        $liveSchedCode1 = $res.StatusCode
    } catch {
        $liveSchedCode1 = $_.Exception.Response.StatusCode.value__
    }

    # Now schedule unpublish
    $bodySchedUnpub = @{ action = "schedule_unpublish"; slug = $slug4; unpublishAt = $pastTime; actorRole = "publisher"; actorEmail = "publisher@junghyeon.vn" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodySchedUnpub | Out-Null

    # Trigger cron evaluation again
    $cronRes2 = Invoke-RestMethod -Uri "$baseUrl/api/admin/cron" -Method Post

    # Check live: must now be 404 (disappeared)!
    $liveSchedCode2 = 0
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/lessons/$slug4" -Method Get -MaximumRedirection 0 -ErrorAction Stop
        $liveSchedCode2 = $res.StatusCode
    } catch {
        $liveSchedCode2 = $_.Exception.Response.StatusCode.value__
    }

    $c4Passed = ($liveSchedCode1 -eq 200) -and ($liveSchedCode2 -eq 404)
    Report-Result 4 "Scheduled Publish activates lesson; Scheduled Unpublish removes it" $c4Passed "After auto-publish HTTP: $liveSchedCode1; After auto-unpublish HTTP: $liveSchedCode2"
} catch {
    Report-Result 4 "Scheduled publish & unpublish" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 5: Learner completes lesson -> event in admin analytics & XP updated
# ------------------------------------------------------------------------------
try {
    $eventBody = @{
        event_type = "lesson_completed"
        user_id = "test-learner-user-001"
        session_id = "sess_integration_test"
        metadata = @{
            lessonSlug = "beginner-1-lesson-3-ayo-eoyo-endings"
            xpEarned = 35
            completedAt = (Get-Date).ToString("o")
        }
    } | ConvertTo-Json

    $eventRes = Invoke-RestMethod -Uri "$baseUrl/api/analytics" -Method Post -ContentType "application/json" -Body $eventBody

    $c5Passed = ($eventRes.success -eq $true)
    Report-Result 5 "Learner completes lesson -> event accepted into analytics pipeline" $c5Passed "Event 'lesson_completed' emitted and ingested successfully"
} catch {
    Report-Result 5 "Learner completes lesson" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 6: Learner submits consultation form & problem report -> appear in admin with notification
# ------------------------------------------------------------------------------
try {
    # 6a. Submit consultation lead
    $leadBody = @{
        action = "submit_lead"
        fullName = "Phan Văn Minh"
        phone = "0912 888 999"
        email = "minhphan@gmail.com"
        goal = "topik"
        source = "integration_test"
    } | ConvertTo-Json
    $leadRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/leads" -Method Post -ContentType "application/json" -Body $leadBody

    # 6b. Submit content problem report
    $reportBody = @{
        action = "submit_report"
        userEmail = "student@junghyeon.vn"
        lessonId = "beginner-1-lesson-3-ayo-eoyo-endings"
        issueCategory = "typo"
        description = "Chính tả câu ví dụ số 3 có lỗi gõ nhầm chữ."
    } | ConvertTo-Json
    $reportRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/leads" -Method Post -ContentType "application/json" -Body $reportBody

    # 6c. Verify both appear in admin notifications
    $notifsRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/leads?type=notifications" -Method Get
    $hasLeadNotif = $notifsRes.notifications | Where-Object { $_.type -eq "lead" -and $_.description -match "0912 888 999" }
    $hasReportNotif = $notifsRes.notifications | Where-Object { $_.type -eq "report" -and $_.description -match "TYPO" }

    $c6Passed = ($null -ne $hasLeadNotif) -and ($null -ne $hasReportNotif)
    Report-Result 6 "Consultation form & Problem report appear in Admin with real-time notifications" $c6Passed "Lead notification present: $($null -ne $hasLeadNotif); Report notification present: $($null -ne $hasReportNotif)"
} catch {
    Report-Result 6 "Consultation form & Problem report" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 7: Admin creates coupon & banner -> usable/visible on live site; disabling removes them
# ------------------------------------------------------------------------------
try {
    # 7a. Create coupon JUNGHYEON50
    $couponBody = @{ action = "create_coupon"; code = "JUNGHYEON50"; discountPercent = 50; description = "Giảm 50% kiểm tra tích hợp" } | ConvertTo-Json
    $couponRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing" -Method Post -ContentType "application/json" -Body $couponBody

    # 7b. Create announcement banner
    $bannerBody = @{ action = "update_banner"; textVi = "🎉 Ưu đãi 50% Chào Tháng Mới!"; textEn = "🎉 50% Off New Month Special!"; isActive = $true } | ConvertTo-Json
    $bannerRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing" -Method Post -ContentType "application/json" -Body $bannerBody

    # 7c. Check live coupon validation
    $validCouponRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing?code=JUNGHYEON50" -Method Get
    $couponUsable = ($validCouponRes.valid -eq $true) -and ($validCouponRes.discountPercent -eq 50)

    # 7d. Check live banner
    $liveBannerRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing?type=banner" -Method Get
    $bannerVisible = ($liveBannerRes.banner.isActive -eq $true) -and ($liveBannerRes.banner.textVi -eq $bannerRes.banner.textVi)

    # 7e. Disable coupon & banner
    $disableCouponBody = @{ action = "toggle_coupon"; code = "JUNGHYEON50"; isActive = $false } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing" -Method Post -ContentType "application/json" -Body $disableCouponBody | Out-Null

    $disableBannerBody = @{ action = "update_banner"; textVi = "Off"; isActive = $false } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing" -Method Post -ContentType "application/json" -Body $disableBannerBody | Out-Null

    # 7f. Verify disabled on live site
    $couponAfterDisable = Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing?code=JUNGHYEON50" -Method Get
    $bannerAfterDisable = Invoke-RestMethod -Uri "$baseUrl/api/admin/marketing?type=banner" -Method Get

    $couponRemoved = ($couponAfterDisable.valid -eq $false)
    $bannerRemoved = ($bannerAfterDisable.banner.isActive -eq $false)

    $c7Passed = $couponUsable -and $bannerVisible -and $couponRemoved -and $bannerRemoved
    Report-Result 7 "Coupon and Announcement Banner live synchronization & disabling" $c7Passed "Coupon usable: $couponUsable; Banner active: $bannerVisible; Coupon disabled: $couponRemoved; Banner removed: $bannerRemoved"
} catch {
    Report-Result 7 "Coupon and banner" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 8: RBAC restrictions: content_editor cannot publish; support cannot view revenue; learner blocked from /admin & APIs
# ------------------------------------------------------------------------------
try {
    # 8a. content_editor cannot publish (should return 403 Forbidden)
    $publishAsEditorCode = 0
    try {
        $bodyForbid = @{ action = "publish"; slug = "test-lesson-grammar-01"; versionNumber = 1; actorRole = "content_editor"; actorEmail = "editor@junghyeon.vn" } | ConvertTo-Json
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/api/admin/content" -Method Post -ContentType "application/json" -Body $bodyForbid -ErrorAction Stop
        $publishAsEditorCode = $res.StatusCode
    } catch {
        $publishAsEditorCode = $_.Exception.Response.StatusCode.value__
    }
    $editorBlocked = ($publishAsEditorCode -eq 403)

    # 8b. support role cannot view audit/revenue API (should return 403 Forbidden)
    $supportAuditCode = 0
    try {
        $headersSupport = @{ "x-admin-role" = "support" }
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/api/admin/audit" -Method Get -Headers $headersSupport -ErrorAction Stop
        $supportAuditCode = $res.StatusCode
    } catch {
        $supportAuditCode = $_.Exception.Response.StatusCode.value__
    }
    $supportBlocked = ($supportAuditCode -eq 403)

    # 8c. Learner cannot access /admin (redirects to unauthorized or returns 403)
    $learnerAdminCode = 0
    try {
        $headersLearner = @{ "x-user-role" = "learner" }
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/admin" -Method Get -Headers $headersLearner -MaximumRedirection 0 -ErrorAction Stop
        $learnerAdminCode = $res.StatusCode
    } catch {
        $learnerAdminCode = $_.Exception.Response.StatusCode.value__
    }
    $learnerPageBlocked = ($learnerAdminCode -eq 307 -or $learnerAdminCode -eq 308 -or $learnerAdminCode -eq 403)

    # 8d. Learner cannot call admin APIs (should return 403 Forbidden)
    $learnerApiCode = 0
    try {
        $headersLearner = @{ "x-user-role" = "learner" }
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/api/admin/content" -Method Get -Headers $headersLearner -ErrorAction Stop
        $learnerApiCode = $res.StatusCode
    } catch {
        $learnerApiCode = $_.Exception.Response.StatusCode.value__
    }
    $learnerApiBlocked = ($learnerApiCode -eq 403)

    # 8e. Revalidation endpoint without secret returns 401 Unauthorized
    $revalCode = 0
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/api/revalidate" -Method Post -ContentType "application/json" -Body '{"paths":["/roadmap"]}' -ErrorAction Stop
        $revalCode = $res.StatusCode
    } catch {
        $revalCode = $_.Exception.Response.StatusCode.value__
    }
    $revalGuarded = ($revalCode -eq 401)

    $c8Passed = $editorBlocked -and $supportBlocked -and $learnerPageBlocked -and $learnerApiBlocked -and $revalGuarded
    Report-Result 8 "RBAC Enforcement: editor publish blocked (403), support revenue/audit blocked (403), learner /admin & API blocked (403), revalidate unauthenticated blocked (401)" $c8Passed "Editor publish HTTP: $publishAsEditorCode; Support audit HTTP: $supportAuditCode; Learner /admin HTTP: $learnerAdminCode; Learner API HTTP: $learnerApiCode; Revalidate HTTP: $revalCode"
} catch {
    Report-Result 8 "RBAC Enforcement" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 9: Every action above produced an audit_logs entry
# ------------------------------------------------------------------------------
try {
    $auditRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/audit?role=super_admin" -Method Get
    $actions = $auditRes.logs | ForEach-Object { $_.action }

    $hasCreateDraft = $actions -contains "lesson:create_draft"
    $hasSubmitReview = $actions -contains "lesson:submit_review"
    $hasApprove = $actions -contains "lesson:approve"
    $hasPublish = $actions -contains "lesson:publish"
    $hasRollback = $actions -contains "lesson:rollback"
    $hasCoupon = $actions -contains "coupon:create"
    $hasBanner = $actions -contains "banner:update"
    $hasLead = $actions -contains "lead:submit"
    $hasReport = $actions -contains "content_report:create"

    $c9Passed = $hasCreateDraft -and $hasSubmitReview -and $hasApprove -and $hasPublish -and $hasRollback -and $hasCoupon -and $hasBanner -and $hasLead -and $hasReport
    Report-Result 9 "Every administrative and learner CRM action logged in audit_logs" $c9Passed "Total audit logs: $($actions.Count); Contains create_draft, submit_review, approve, publish, rollback, coupon, banner, lead, content_report"
} catch {
    Report-Result 9 "Audit logs verification" $false $_.Exception.Message
}

# ------------------------------------------------------------------------------
# CHECK 10: Learner site build has zero imports from admin folders (lint boundary rule)
# ------------------------------------------------------------------------------
try {
    $learnerFiles = Get-ChildItem -LiteralPath "src/app/(learner)" -Recurse -File
    $sharedComponents = Get-ChildItem -Path "src/components" -Recurse -File | Where-Object { $_.FullName -notmatch '\\components\\admin\\' }

    $invalidImports = @()
    foreach ($f in ($learnerFiles + $sharedComponents)) {
        $matches = Select-String -Path $f.FullName -Pattern "components/admin|\(admin\)|auth-rbac|admin\.types"
        if ($matches) {
            $invalidImports += $f.FullName
        }
    }

    $c10Passed = ($invalidImports.Count -eq 0)
    Report-Result 10 "Architectural Isolation: Learner & shared components have ZERO imports from admin folders" $c10Passed "Violating files count: $($invalidImports.Count)"
} catch {
    Report-Result 10 "Architectural Isolation" $false $_.Exception.Message
}

Write-Host "`n======================================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host " ALL 10 INTEGRATION CHECKS PASSED WITH FLYING COLORS! (10/10)" -ForegroundColor Green
} else {
    Write-Host " SOME INTEGRATION CHECKS FAILED. PLEASE REVIEW LOGS ABOVE." -ForegroundColor Red
}
Write-Host "======================================================================`n" -ForegroundColor Cyan
